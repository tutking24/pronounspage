import jwt from './jwt';
import {makeId, renderJson} from '../src/helpers';
const dbConnection = require('./db');
const SQL = require('sql-template-strings');
import { ulid } from 'ulid';
import translations from "./translations";
const mailer = require('./mailer');
import authenticate from './authenticate';

const now = Math.floor(Date.now() / 1000);

const USERNAME_CHARS = 'A-Za-zĄĆĘŁŃÓŚŻŹąćęłńóśżź0-9._-';

const normalise = s => s.trim().toLowerCase();

const saveAuthenticator = async (db, type, user, payload, validForMinutes = null) => {
    const id = ulid();
    await db.get(SQL`INSERT INTO authenticators (id, userId, type, payload, validUntil) VALUES (
        ${id},
        ${user ? user.id : null},
        ${type},
        ${JSON.stringify(payload)},
        ${validForMinutes ? (now + validForMinutes * 60) : null}
    )`);
    return id;
}

const findAuthenticator = async (db, id, type) => {
    const authenticator = await db.get(SQL`SELECT * FROM authenticators
        WHERE id = ${id}
        AND type = ${type}
        AND (validUntil IS NULL OR validUntil > ${now})
    `);

    if (authenticator) {
        authenticator.payload = JSON.parse(authenticator.payload);
    }

    return authenticator
}

const invalidateAuthenticator = async (db, id) => {
    await db.get(SQL`UPDATE authenticators
        SET validUntil = ${now}
        WHERE id = ${id}
    `);
}

const init = async (db, usernameOrEmail) => {
    let user = undefined;

    const isEmail = usernameOrEmail.indexOf('@') > -1;
    let isTest = false;

    if (process.env.NODE_ENV === 'development' && usernameOrEmail.endsWith('+')) {
        isTest = true;
        usernameOrEmail = usernameOrEmail.substring(0, usernameOrEmail.length - 1);
    }

    if (isEmail) {
        user = await db.get(SQL`SELECT * FROM users WHERE email = ${normalise(usernameOrEmail)}`);
    } else {
        user = await db.get(SQL`SELECT * FROM users WHERE lower(trim(username)) = ${normalise(usernameOrEmail)}`);
    }

    if (!user && !isEmail) {
        return {error: 'user.login.userNotFound'}
    }

    const payload = {
        username: isEmail ? (user ? user.username : null) : usernameOrEmail,
        email: isEmail ? normalise(usernameOrEmail) : user.email,
        code: isTest ? '999999' : makeId(6, '0123456789'),
    }

    const codeKey = await saveAuthenticator(db, 'email', user, payload, 15);

    if (!isTest) {
        mailer(
            payload.email,
            `[${translations.title}] ${translations.user.login.email.subject.replace('%code%', payload.code)}`,
            translations.user.login.email.content.replace('%code%', payload.code),
        )
    }

    return {
        token: jwt.sign({...payload, code: null, codeKey}, '15m'),
    };
}

const validate = async (db, user, code) => {
    if (!user || !user.codeKey) {
        return {error: 'user.tokenExpired'};
    }

    const authenticator = await findAuthenticator(db, user.codeKey, 'email');
    if (!authenticator) {
        return {error: 'user.tokenExpired'};
    }

    if (authenticator.payload.code !== normalise(code)) {
        return {error: 'user.code.invalid'};
    }

    await invalidateAuthenticator(db, authenticator);

    return await issueAuthentication(db, user);
}

const defaultUsername = async (db, email) => {
    const base = email.substring(0, email.indexOf('@'))
        .padEnd(4, '0')
        .substring(0, 12)
        .replace(new RegExp(`[^${USERNAME_CHARS}]`, 'g'), '_');

    let c = 0;
    while (true) {
        let proposal = base + (c || '');
        let dbUser = await db.get(SQL`SELECT id FROM users WHERE lower(trim(username)) = ${normalise(proposal)}`);
        if (!dbUser) {
            return proposal;
        }
        c++;
    }
}

const issueAuthentication = async (db, user) => {
    let dbUser = await db.get(SQL`SELECT * FROM users WHERE email = ${normalise(user.email)}`);
    if (!dbUser) {
        dbUser = {
            id: ulid(),
            username: await defaultUsername(db, user.email),
            email: normalise(user.email),
            roles: 'user',
            avatarSource: null,
        }
        await db.get(SQL`INSERT INTO users(id, username, email, roles, avatarSource)
            VALUES (${dbUser.id}, ${dbUser.username}, ${dbUser.email}, ${dbUser.roles}, ${dbUser.avatarSource})`)
    }

    return {
        token: jwt.sign({
            ...dbUser,
            authenticated: true,
        }),
    };
}

const changeUsername = async (db, user, username) => {
    if (username.length < 4 || username.length > 16 || !username.match(new RegExp(`^[${USERNAME_CHARS}]+$`))) {
        return { error: 'user.account.changeUsername.invalid' }
    }

    const dbUser = await db.get(SQL`SELECT * FROM users WHERE lower(trim(username)) = ${normalise(username)}`);
    if (dbUser) {
        return { error: 'user.account.changeUsername.taken' }
    }

    await db.get(SQL`UPDATE users SET username = ${username} WHERE email = ${normalise(user.email)}`);

    return await issueAuthentication(db, user);
}

export default async function (req, res, next) {
    const db = await dbConnection();
    const user = authenticate(req);

    if (req.method === 'POST' && req.url === '/init' && req.body.usernameOrEmail) {
        return renderJson(res, await init(db, req.body.usernameOrEmail));
    }

    if (req.method === 'POST' && req.url === '/validate' && req.body.code) {
        return renderJson(res, await validate(db, user, req.body.code));
    }

    if (req.method === 'POST' && req.url === '/change-username' && user && user.authenticated && req.body.username) {
        return renderJson(res, await changeUsername(db, user, req.body.username));
    }

    return renderJson(res, {error: 'Not found'}, 404);
}
