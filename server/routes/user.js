import { Router } from 'express';
import SQL from 'sql-template-strings';
import {ulid} from "ulid";
import {buildDict, makeId, now, handleErrorAsync, obfuscateEmail} from "../../src/helpers";
import jwt from "../../src/jwt";
import mailer from "../../src/mailer";
import { loadSuml } from '../loader';
import avatar from '../avatar';
import { config as socialLoginConfig, handlers as socialLoginHandlers } from '../social';
import cookieSettings from "../../src/cookieSettings";
import {validateCaptcha} from "../captcha";
import assert from "assert";
import {addMfaInfo} from './mfa';
import buildLocaleList from "../../src/buildLocaleList";
import {lookupBanArchive} from '../ban';
import copyAvatar from '../avatarCopy';
import { usernameRegex, usernameUnsafeRegex } from '../../src/username';
const config = loadSuml('config');
const translations = loadSuml('translations');

export const normalise = s => s.trim().toLowerCase();

const isSpam = (email) => {
    const noDots = email.replace(/\./g, '');
    return noDots === 'javierfranciscotmp@gmailcom'
        || noDots === 'leahmarykathryntmp@gmailcom'
        || noDots === 'janeesevictorjh@gmail.com'
        || email.includes('dogazu')
        || email.includes('narodowcy.net')
        || email.length > 128;
}

const replaceExtension = username => username
    .replace(/\.(txt|jpg|jpeg|png|pdf|gif|doc|docx|csv|js|css|html)$/i, '_$1')
    .replace(/\.$/, '')
;

export const saveAuthenticator = async (db, type, user, payload, validForMinutes = null) => {
    if (!user && await lookupBanArchive(db, type, payload)) {
        throw new Error('banned');
    }
    const id = ulid();
    await db.get(SQL`INSERT INTO authenticators (id, userId, type, payload, validUntil) VALUES (
        ${id},
        ${user ? user.id : null},
        ${type},
        ${JSON.stringify(payload)},
        ${validForMinutes ? (now() + validForMinutes * 60) : null}
    )`);
    return id;
}

export const findAuthenticatorById = async (db, id, type) => {
    const authenticator = await db.get(SQL`SELECT * FROM authenticators
        WHERE id = ${id}
        AND type = ${type}
        AND (validUntil IS NULL OR validUntil > ${now()})
    `);

    if (authenticator) {
        authenticator.payload = JSON.parse(authenticator.payload);
    }

    return authenticator
}

export const findAuthenticatorsByUser = async (db, user, type) => {
    const authenticators = await db.all(SQL`
        SELECT * FROM authenticators
        WHERE userId = ${user.id}
        AND type = ${type}
        AND (validUntil IS NULL OR validUntil > ${now()})
    `);

    return authenticators.map(a => {
        a.payload = JSON.parse(a.payload);

        return a;
    });
}

const findLatestEmailAuthenticator = async (db, email, type) => {
    const authenticator = await db.get(SQL`SELECT * FROM authenticators
        WHERE payload LIKE ${'%"email":"' + email + '"%'}
        AND type = ${type}
        AND (validUntil IS NULL OR validUntil > ${now()})
        ORDER BY id DESC
    `);

    if (authenticator) {
        authenticator.payload = JSON.parse(authenticator.payload);
    }

    return authenticator
}

export const invalidateAuthenticator = async (db, id) => {
    await db.get(SQL`UPDATE authenticators
        SET validUntil = ${now()}
        WHERE id = ${id}
    `);
}

const defaultUsername = async (db, email) => {
    const base = normalise(
        replaceExtension(
            email.substring(0, email.includes('@') ? email.indexOf('@') : email.length)
                .padEnd(4, '0')
                .substring(0, 14)
                .replace(usernameUnsafeRegex, '_')
        )
    );

    const conflicts = (await db.all(SQL`SELECT usernameNorm FROM users WHERE usernameNorm LIKE ${normalise(base) + '%'}`))
        .map(({usernameNorm}) => usernameNorm);

    let c = 0;
    while (true) {
        let proposal = base + (c || '');
        if (!conflicts.includes(proposal)) {
            return proposal;
        }
        c++;
    }
}

const fetchOrCreateUser = async (db, user, avatarSource = 'gravatar') => {
    let dbUser = user.email
        ? await db.get(SQL`SELECT * FROM users WHERE email = ${normalise(user.email)}`)
        : await db.get(SQL`SELECT * FROM users WHERE usernameNorm = ${normalise(user.username)}`)

    if (!dbUser) {
        dbUser = {
            id: ulid(),
            username: await defaultUsername(db, user.name || user.email),
            email: normalise(user.email),
            roles: '',
            avatarSource: avatarSource,
        }
        await db.get(SQL`INSERT INTO users(id, username, usernameNorm, email, roles, avatarSource)
            VALUES (${dbUser.id}, ${dbUser.username}, ${normalise(dbUser.username)}, ${dbUser.email}, ${dbUser.roles}, ${dbUser.avatarSource})`)
    }

    dbUser.avatar = await avatar(db, dbUser);

    return dbUser;
}

export const issueAuthentication = async (db, user, fetch = true, guardMfa = false, extend = undefined) => {
    if (fetch) {
        user = await fetchOrCreateUser(db, user);
    }

    if (user.mfa === undefined && user.id) {
        user = await addMfaInfo(db, user, guardMfa);
    }

    if (!user.mfaRequired) {
        user.authenticated = true;
    }

    user.avatar = await avatar(db, user);
    delete user.suspiciousChecked;
    delete user.bannedBy;
    delete user.banSnapshot;
    delete user.timesheets;

    if (extend) {
        user = {
            ...user,
            ...extend,
        }
    }

    return jwt.sign(user);
}

export const validateEmail = async (email) => {
    email = normalise(String(email));
    if (email.endsWith('.oauth')) {
        return;
    }
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(email)) {
        return false;
    }
    const { Resolver } = require('dns').promises;
    const dns = new Resolver();
    try {
        const addresses = await dns.resolveMx(email.split('@')[1]);
        return addresses.length > 0;
    } catch {
        return false;
    }
}

export const deduplicateEmail = async (db, email, cbSuccess, cbFail, ttl = 5 * 60) => {
    const count = (await db.get(SQL`SELECT COUNT(*) AS c FROM emails WHERE email = ${email} AND sentAt >= ${now() - ttl}`)).c;
    if (count > 0) {
        console.error('Duplicate email requests for ' + email);
        if (cbFail) { await cbFail(); }
        return;
    }
    await cbSuccess();
    await db.get(SQL`INSERT INTO emails (email, sentAt) VALUES (${email}, ${now()});`);
}

export const deduplicateEmailPreset = async (db, email, template, params = {}, ttl = 5 * 60) => {
    await deduplicateEmail(
        db,
        email,
        async () => {
            mailer(email, template, params);
        },
        async () => {
        },
        ttl,
    );
}

const reloadUser = async (req, res, next) => {
    if (!req.url.startsWith('/user/') && req.method === 'GET') {
        next();
        return;
    }

    if (!req.user) {
        next();
        return;
    }

    let dbUser = await req.db.get(SQL`SELECT * FROM users WHERE id = ${req.user.id}`);

    if (!dbUser) {
        res.clearCookie('token');
        next();
        return;
    }

    dbUser = await addMfaInfo(req.db, dbUser);

    await req.db.get(SQL`UPDATE users SET lastActive = ${+new Date} WHERE id = ${req.user.id}`);

    if (req.user.username !== dbUser.username
        || req.user.email !== dbUser.email
        || req.user.roles !== dbUser.roles
        || req.user.avatarSource !== dbUser.avatarSource
        || req.user.bannedReason !== dbUser.bannedReason
        || req.user.mfa !== dbUser.mfa
    ) {
        const token = await issueAuthentication(req.db, dbUser, false);
        res.cookie('token', token, cookieSettings);
        req.rawUser = jwt.validate(token);
        req.user = req.rawUser;
    }
    next();
}

const resetCards = async (db, id) => {
    await db.get(SQL`UPDATE profiles SET card = null, cardDark = null WHERE userId = ${id}`);
}

const MAX_LOGIN_ATTEMPTS_COUNT = 3;
const MAX_LOGIN_ATTEMPTS_BLOCK_MS = 60 * 60 * 1000;

export const fetchLoginAttempts = async (db, userId) => {
    const user = await db.get(SQL`SELECT loginAttempts FROM users WHERE id = ${userId}`);

    let [ attemptCount, firstAttemptAt ] = (user?.loginAttempts || '0|0').split('|');
    attemptCount = parseInt(attemptCount);
    firstAttemptAt = new Date(parseInt(firstAttemptAt));

    if (firstAttemptAt < new Date() - MAX_LOGIN_ATTEMPTS_BLOCK_MS) {
        attemptCount = 0;
        firstAttemptAt = null;
    }

    return { attemptCount, firstAttemptAt, block: attemptCount >= MAX_LOGIN_ATTEMPTS_COUNT };
};

export const saveLoginAttempts = async (db, userId, attemptCount, firstOneAt) => {
    const loginAttempts = `${attemptCount}|${firstOneAt.getTime()}`
    await db.get(SQL`UPDATE users SET loginAttempts = ${loginAttempts} WHERE id = ${userId}`);
}

const router = Router();

router.use(handleErrorAsync(reloadUser));

export const loadCurrentUser = async (req, res) => {
    if (!req.user) {
        res.clearCookie('token');
        return res.json(null);
    }

    let dbUser = await req.db.get(SQL`SELECT * FROM users WHERE id = ${req.user.id}`);

    if (!dbUser) {
        res.clearCookie('token');
        return res.json(null);
    }

    delete dbUser.timesheets;

    const token = await issueAuthentication(req.db, dbUser, false);
    res.cookie('token', token, cookieSettings);
    req.rawUser = jwt.validate(token);
    req.user = req.rawUser;

    return res.json({...req.user, token});
};

router.get('/user/current', handleErrorAsync(loadCurrentUser));

router.post('/user/init', handleErrorAsync(async (req, res) => {
    if (req.body.usernameOrEmail && isSpam(req.body.usernameOrEmail || '')) {
        req.socket.end();
        return;
    }

    if (!await validateCaptcha(req.body.captchaToken)) {
        return res.json({error: 'captcha.invalid'});
    }

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
        user = await req.db.get(SQL`SELECT * FROM users WHERE usernameNorm = ${normalise(usernameOrEmail)}`);
    }

    if (!user && !isEmail) {
        return res.json({error: 'user.login.userNotFound'})
    }

    if (user) {
        const { block } = await fetchLoginAttempts(req.db, user.id);
        if (block) {
            return res.json({error: 'user.tooManyAttempts'});
        }
    }

    const payload = {
        username: isEmail ? (user ? user.username : null) : usernameOrEmail,
        email: isEmail ? normalise(usernameOrEmail) : user.email,
        code: isTest ? '999999' : makeId(6, '0123456789'),
    }

    if (!await validateEmail(payload.email)) {
        return res.json({ error: 'user.account.changeEmail.invalid' })
    }

    if (!user && await lookupBanArchive(req.db, 'email', payload)) {
        return res.status(401).json({error: 'Unauthorised'});
    }

    let codeKey;
    if (isTest) {
        codeKey = await saveAuthenticator(req.db, 'email', user, payload, 15);
    } else {
        await deduplicateEmail(
            req.db,
            payload.email,
            async () => {
                codeKey = await saveAuthenticator(req.db, 'email', user, payload, 15);

                mailer(payload.email, 'confirmCode', { code: payload.code });
            },
            async () => {
                const auth = await findLatestEmailAuthenticator(req.db, payload.email, 'email');
                codeKey = auth ? auth.id : null;
            },
        );
    }

    return res.json({
        token: jwt.sign(
            {
                ...payload,
                email: isEmail ? payload.email : null,
                emailObfuscated: obfuscateEmail(payload.email),
                code: null,
                codeKey,
            },
            '15m',
        ),
    });
}));

router.post('/user/validate', handleErrorAsync(async (req, res) => {
    if (!req.rawUser || !req.rawUser.codeKey) {
        return res.json({error: 'user.tokenExpired'});
    }

    const authenticator = await findAuthenticatorById(req.db, req.rawUser.codeKey, 'email');
    if (!authenticator) {
        return res.json({error: 'user.tokenExpired'});
    }

    const { attemptCount, firstAttemptAt, block } = await fetchLoginAttempts(req.db, authenticator.userId);
    if (block) {
        return res.json({error: 'user.tooManyAttempts'});
    }

    if (authenticator.payload.code !== normalise(req.body.code)) {
        await saveLoginAttempts(req.db, authenticator.userId, attemptCount + 1, firstAttemptAt || new Date());
        return res.json({error: 'user.code.invalid'});
    }

    await invalidateAuthenticator(req.db, authenticator);

    return res.json({token: await issueAuthentication(req.db, req.rawUser, true, true)});
}));

router.post('/user/change-username', handleErrorAsync(async (req, res) => {
    if (!req.user) {
        return res.status(401).json({error: 'Unauthorised'});
    }

    if (req.body.username.length < 4 || req.body.username.length > 16 || !req.body.username.match(usernameRegex)) {
        return res.json({ error: 'user.account.changeUsername.invalid' });
    }

    req.body.username = replaceExtension(req.body.username);

    const dbUser = await req.db.get(SQL`SELECT * FROM users WHERE usernameNorm = ${normalise(req.body.username)}`);
    if (dbUser && dbUser.id !== req.user.id) {
        return res.json({ error: 'user.account.changeUsername.taken' })
    }

    await req.db.get(SQL`UPDATE users SET username = ${req.body.username}, usernameNorm = ${normalise(req.body.username)} WHERE id = ${req.user.id}`);

    await resetCards(req.db, req.user.id);

    return res.json({token: await issueAuthentication(req.db, req.user)});
}));

router.post('/user/change-email', handleErrorAsync(async (req, res) => {
    if (!req.user || req.user.bannedReason || isSpam(req.body.email || '')) {
        return res.status(401).json({error: 'Unauthorised'});
    }

    if (!await validateEmail(normalise(req.body.email))) {
        return res.json({ error: 'user.account.changeEmail.invalid' })
    }

    const dbUser = await req.db.get(SQL`SELECT * FROM users WHERE lower(trim(email)) = ${normalise(req.body.email)}`);
    if (dbUser) {
        return res.json({ error: 'user.account.changeEmail.taken' })
    }

    if (!req.body.authId) {
        if (!await validateCaptcha(req.body.captchaToken)) {
            return res.json({error: 'captcha.invalid'});
        }

        const payload = {
            from: req.user.email,
            to: normalise(req.body.email),
            code: makeId(6, '0123456789'),
        };

        const authId = await saveAuthenticator(req.db, 'changeEmail', req.user, payload, 15);

        mailer(payload.to, 'confirmCode', { code: payload.code });

        return res.json({ authId });
    }

    const authenticator = await findAuthenticatorById(req.db, req.body.authId, 'changeEmail');
    if (!authenticator) {
        return res.json({error: 'user.tokenExpired'});
    }

    if (authenticator.payload.code !== normalise(req.body.code)) {
        return res.json({error: 'user.code.invalid'});
    }

    await invalidateAuthenticator(req.db, authenticator);

    await req.db.get(SQL`UPDATE users SET email = ${authenticator.payload.to} WHERE id = ${req.user.id}`);
    req.user.email = authenticator.payload.to;

    return res.json({token: await issueAuthentication(req.db, req.user)});
}));

router.post('/user/delete', handleErrorAsync(async (req, res) => {
    if (!req.user) {
        return res.status(401).json({error: 'Unauthorised'});
    }

    await req.db.get('PRAGMA foreign_keys = ON');
    await req.db.get(SQL`DELETE FROM users WHERE id = ${req.user.id}`);

    return res.json(true);
}));

router.post('/user/data-erasure/:id', handleErrorAsync(async (req, res) => {
    if (!req.isGranted('users')) {
        return res.status(401).json({error: 'Unauthorised'});
    }

    await req.db.get('PRAGMA foreign_keys = ON');
    await req.db.get(SQL`DELETE FROM users WHERE id = ${req.params.id}`);

    return res.json(true);
}));

router.post('/user/:id/set-roles', handleErrorAsync(async (req, res) => {
    if (!req.isGranted('*')) {
        return res.status(401).json({error: 'Unauthorised'});
    }

    await req.db.get(SQL`UPDATE users SET roles = ${req.body.roles} WHERE id = ${req.params.id}`);

    return res.json('ok');
}));

// happens on home
router.get('/user/social-redirect/:provider/:locale', handleErrorAsync(async (req, res) => {
    assert(req.locales.hasOwnProperty(req.params.locale));
    req.session.socialRedirect = req.params.locale;
    return res.redirect(`/api/connect/${req.params.provider}?${new URLSearchParams({
        instance: req.query.instance || undefined,
    })}`);
}));

// happens on home
router.get('/user/social/:provider', handleErrorAsync(async (req, res) => {
    if (!req.session.grant || !req.session.grant.response
        || (!req.session.grant.response.access_token && !req.session.grant.response.jwt)
        || !socialLoginHandlers[req.params.provider]) {
        console.error('Social login failed, session incomplete.', req.params.provider, req.session, req.session.grant.response);
        return res.status(400).json({error: 'Something went wrong… Please try again.'})
    }

    const payload = socialLoginHandlers[req.params.provider](req.session.grant.response);

    if (payload.id === undefined) {
        console.error('Social login failed, payload has no id.', req.params.provider, req.payload);
        return res.status(400).json({error: 'Something went wrong… Please try again.'})
    }

    const auth = await req.db.get(SQL`
        SELECT * FROM authenticators
        WHERE type = ${req.params.provider}
        AND payload LIKE ${'{"id":"' + payload.id + '"%'}
        AND (validUntil IS NULL OR validUntil > ${now()})
    `)

    const user = auth ? await req.db.get(SQL`
        SELECT * FROM users
        WHERE id = ${auth.userId}
    `) : req.user;

    const dbUser = await fetchOrCreateUser(req.db, user || {
        email: payload.email || `${payload.id}@${req.params.provider}.oauth`,
        name: payload.name,
    }, req.params.provider);

    const token = await issueAuthentication(req.db, dbUser, false, true);

    if (auth) {
        await invalidateAuthenticator(req.db, auth.id);
    }
    if (!payload.avatarCopy && payload.avatar) {
        payload.avatarCopy = await copyAvatar(req.params.provider, payload.avatar);
    }

    await saveAuthenticator(req.db, req.params.provider, dbUser, payload);

    const buildRedirectUrl = () => {
        if (!req.session.socialRedirect) {
            return '/' + config.user.route;
        }
        const host = process.env.NODE_ENV === 'development' ? '' : buildLocaleList(config.locale, true)[req.session.socialRedirect].url;
        delete req.session.socialRedirect;

        return `${host}/api/user/social-redirect-callback/${encodeURIComponent(token)}`;
    }

    return res.cookie('token', token, cookieSettings).redirect(buildRedirectUrl());
}));

// happens on locale
router.get('/user/social-redirect-callback/:token', handleErrorAsync(async (req, res) => {
    res.cookie('token', req.params.token, cookieSettings).redirect('/' + config.user.route);
}));

router.get('/user/social-connections', handleErrorAsync(async (req, res) => {
    if (!req.user) {
        return res.status(401).json({error: 'Unauthorised'});
    }

    const authenticators = await req.db.all(SQL`
        SELECT type, payload FROM authenticators
        WHERE type IN (`.append(Object.keys(socialLoginConfig).map(k => `'${k}'`).join(',')).append(SQL`)
        AND userId = ${req.user.id}
        AND (validUntil IS NULL OR validUntil > ${now()})
    `));

    return res.json(buildDict(function* () {
        for (let auth of authenticators) {
            yield [auth.type, JSON.parse(auth.payload)];
        }
    }));
}));

router.post('/user/social-connection/:provider/disconnect', handleErrorAsync(async (req, res) => {
    if (!req.user) {
        return res.status(401).json({error: 'Unauthorised'});
    }

    const auth = await req.db.get(SQL`
        SELECT id FROM authenticators
        WHERE type = ${req.params.provider}
        AND userId = ${req.user.id}
        AND (validUntil IS NULL OR validUntil > ${now()})
    `)

    await invalidateAuthenticator(req.db, auth.id)

    return res.json('ok');
}));

router.post('/user/set-avatar', handleErrorAsync(async (req, res) => {
    if (!req.user) {
        return res.status(401).json({error: 'Unauthorised'});
    }

    await req.db.get(SQL`
        UPDATE users
        SET avatarSource = ${req.body.source || null}
        WHERE id = ${req.user.id}
    `)

    await resetCards(req.db, req.user.id);

    return res.json({token: await issueAuthentication(req.db, req.user)});
}));

router.get('/user/init-universal/:token', handleErrorAsync(async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    if (req.user) {
        return res.json('Already logged in');
    }

    res.cookie('token', req.params.token, cookieSettings);
    return res.json('Token saved');
}));

router.get('/user/logout-universal', handleErrorAsync(async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.clearCookie('token');
    return res.json('Token removed');
}));

const canImpersonate = (req) => {
    return req.isGranted('*') || req.isGranted('impersonate') || (
        req.isGranted('users') && ['example@pronouns.page'].includes(req.params.email)
    );
}

router.get('/admin/impersonate/:email', handleErrorAsync(async (req, res) => {
    if (!canImpersonate(req)) {
        return res.status(401).json({error: 'Unauthorised'});
    }

    let email = req.params.email;
    if (!email.includes('@')) {
        email = (await req.db.get(SQL`SELECT email FROM users WHERE usernameNorm = ${normalise(email)}`)).email;
    }

    return res.json({token: await issueAuthentication(req.db, {email: email})});
}));

export default router;
