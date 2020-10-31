import { Router } from 'express';
import SQL from 'sql-template-strings';
import {ulid} from "ulid";
import {makeId} from "../../src/helpers";
import translations from "../translations";
import jwt from "../../src/jwt";
import mailer from "../../src/mailer";

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

const validateEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

const router = Router();

router.post('/user/init', async (req, res) => {
    let user = undefined;
    let usernameOrEmail = req.body.usernameOrEmail;

    const isEmail = usernameOrEmail.indexOf('@') > -1;
    let isTest = false;

    if (process.env.NODE_ENV === 'development' && usernameOrEmail.endsWith('+')) {
        isTest = true;
        usernameOrEmail = usernameOrEmail.substring(0, usernameOrEmail.length - 1);
    }

    if (isEmail) {
        user = await req.db.get(SQL`SELECT * FROM users WHERE email = ${normalise(usernameOrEmail)}`);
    } else {
        user = await req.db.get(SQL`SELECT * FROM users WHERE lower(trim(username)) = ${normalise(usernameOrEmail)}`);
    }

    if (!user && !isEmail) {
        return res.json({error: 'user.login.userNotFound'})
    }

    const payload = {
        username: isEmail ? (user ? user.username : null) : usernameOrEmail,
        email: isEmail ? normalise(usernameOrEmail) : user.email,
        code: isTest ? '999999' : makeId(6, '0123456789'),
    }

    const codeKey = await saveAuthenticator(req.db, 'email', user, payload, 15);

    if (!isTest) {
        mailer(
            payload.email,
            `[${translations.title}] ${translations.user.login.email.subject.replace('%code%', payload.code)}`,
            translations.user.login.email.content.replace('%code%', payload.code),
        )
    }

    return res.json({
        token: jwt.sign({...payload, code: null, codeKey}, '15m'),
    });
});

router.post('/user/validate', async (req, res) => {
    if (!req.rawUser || !req.rawUser.codeKey) {
        return res.json({error: 'user.tokenExpired'});
    }

    const authenticator = await findAuthenticator(req.db, req.rawUser.codeKey, 'email');
    if (!authenticator) {
        return res.json({error: 'user.tokenExpired'});
    }

    if (authenticator.payload.code !== normalise(req.body.code)) {
        return res.json({error: 'user.code.invalid'});
    }

    await invalidateAuthenticator(req.db, authenticator);

    return res.json(await issueAuthentication(req.db, req.rawUser));
});

router.post('/user/change-username', async (req, res) => {
    if (!req.user) {
        return res.status(401).json({error: 'Unauthorised'});
    }

    if (req.body.username.length < 4 || req.body.username.length > 16 || !req.body.username.match(new RegExp(`^[${USERNAME_CHARS}]+$`))) {
        return { error: 'user.account.changeUsername.invalid' }
    }

    const dbUser = await req.db.get(SQL`SELECT * FROM users WHERE lower(trim(username)) = ${normalise(req.body.username)}`);
    if (dbUser) {
        return res.json({ error: 'user.account.changeUsername.taken' })
    }

    await req.db.get(SQL`UPDATE users SET username = ${req.body.username} WHERE email = ${normalise(req.user.email)}`);

    return res.json(await issueAuthentication(req.db, req.user));
});

router.post('/user/change-email', async (req, res) => {
    if (!req.user) {
        return res.status(401).json({error: 'Unauthorised'});
    }

    if (!validateEmail(req.user.email)) {
        return res.json({ error: 'user.account.changeEmail.invalid' })
    }

    const dbUser = await req.db.get(SQL`SELECT * FROM users WHERE lower(trim(email)) = ${normalise(req.body.email)}`);
    if (dbUser) {
        return res.json({ error: 'user.account.changeEmail.taken' })
    }

    if (!req.body.authId) {
        const payload = {
            from: req.user.email,
            to: normalise(req.body.email),
            code: makeId(6, '0123456789'),
        };

        const authId = await saveAuthenticator(req.db, 'changeEmail', req.user, payload, 15);

        mailer(
            payload.to,
            `[${translations.title}] ${translations.user.login.email.subject.replace('%code%', payload.code)}`,
            translations.user.login.email.content.replace('%code%', payload.code),
        )

        return res.json({ authId });
    }

    const authenticator = await findAuthenticator(req.db, req.body.authId, 'changeEmail');
    if (!authenticator) {
        return res.json({error: 'user.tokenExpired'});
    }

    if (authenticator.payload.code !== normalise(req.body.code)) {
        return res.json({error: 'user.code.invalid'});
    }

    await invalidateAuthenticator(req.db, authenticator);

    await req.db.get(SQL`UPDATE users SET email = ${authenticator.payload.to} WHERE email = ${normalise(req.user.email)}`);
    req.user.email = authenticator.payload.to;

    return res.json(await issueAuthentication(req.db, req.user));
});

router.post('/user/delete', async (req, res) => {
    if (!req.user) {
        return res.status(401).json({error: 'Unauthorised'});
    }

    const userId = (await req.db.get(SQL`SELECT id FROM users WHERE username = ${req.user.username}`)).id;
    if (!userId) {
        return res.json(false);
    }

    await req.db.get(SQL`DELETE FROM profiles WHERE userId = ${userId}`)
    await req.db.get(SQL`DELETE FROM authenticators WHERE userId = ${userId}`)
    await req.db.get(SQL`DELETE FROM users WHERE id = ${userId}`)

    return res.json(true);
});

export default router;
