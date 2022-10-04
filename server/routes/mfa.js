import { Router } from 'express';
import {handleErrorAsync} from "../../src/helpers";
import speakeasy from 'speakeasy';
import {
    saveAuthenticator,
    findAuthenticatorsByUser,
    invalidateAuthenticator,
    issueAuthentication,
    normalise,
    fetchLoginAttempts, saveLoginAttempts
} from './user';
import cookieSettings from "../../src/cookieSettings";


export const addMfaInfo = async (db, user, guard = false) => {
    const auths = await findAuthenticatorsByUser(db, user, 'mfa_secret');
    if (auths.length) {
        user.mfa = true;
        if (guard) {
            user.mfaRequired = true;
            user.authenticated = false;
        }
    } else {
        user.mfa = false;
    }
    return user;
}

const disableMfa = async (db, user) => {
    for (let authenticator of [
        ...await findAuthenticatorsByUser(db, user, 'mfa_secret'),
        ...await findAuthenticatorsByUser(db, user, 'mfa_recovery'),
    ]) {
        await invalidateAuthenticator(db, authenticator.id);
    }
}

const router = Router();

router.get('/mfa/get-url', handleErrorAsync(async (req, res) => {
    if (!req.user || req.user.mfa) {
        return res.status(401).json({error: 'Unauthorised'});
    }

    const secret = speakeasy.generateSecret({
        length: 16,
        name: global.translations.title,
    });

    return res.json(secret);
}));

router.post('/mfa/init', handleErrorAsync(async (req, res) => {
    if (!req.user || req.user.mfa) {
        return res.status(401).json({error: 'Unauthorised'});
    }

    const verified = speakeasy.totp.verify({
        secret: req.body.secret,
        encoding: 'base32',
        token: req.body.token
    });

    if (!verified) {
        return res.status(400).json({error: 'Invalid token'});
    }

    await saveAuthenticator(req.db, 'mfa_secret', req.user, req.body.secret);
    const recoveryCodes = [];
    for (let i = 0; i < 5; i++) {
        const code = speakeasy.generateSecretASCII(24);
        recoveryCodes.push(code);
        await saveAuthenticator(req.db, 'mfa_recovery', req.user, code);
    }

    const token = await issueAuthentication(req.db, req.user);

    return res.cookie('token', token, cookieSettings).json(recoveryCodes);
}));

router.post('/mfa/validate', handleErrorAsync(async (req, res) => {
    if (!req.rawUser || !req.rawUser.mfaRequired) {
        return res.json({error: 'user.tokenExpired'});
    }

    if (req.body.recovery) {
        for (let authenticator of await findAuthenticatorsByUser(req.db, req.rawUser, 'mfa_recovery')) {
            if (authenticator.payload === req.body.code.trim()) {
                await disableMfa(req.db, req.rawUser);

                const token = await issueAuthentication(req.db, req.rawUser, true, false, { mfa: false, mfaRequired: false });

                return res.cookie('token', token, cookieSettings).json({token: token});
            }
        }

        return res.json({error: 'user.code.invalid'});
    }

    const authenticator = (await findAuthenticatorsByUser(req.db, req.rawUser, 'mfa_secret'))[0];

    const { attemptCount, firstAttemptAt, block } = await fetchLoginAttempts(req.db, authenticator.userId);
    if (block) {
        return res.json({error: 'user.tooManyAttempts'});
    }

    let tokenValidates = speakeasy.totp.verify({
        secret: authenticator.payload,
        encoding: 'base32',
        token: normalise(req.body.code),
        window: 6
    });

    if (process.env.NODE_ENV === 'development' && normalise(req.body.code) === '999999') {
        tokenValidates = true;
    }

    if (!tokenValidates) {
        await saveLoginAttempts(req.db, authenticator.userId, attemptCount + 1, firstAttemptAt || new Date());

        return res.json({error: 'user.code.invalid'});
    }

    const token = await issueAuthentication(req.db, req.rawUser, true, false, { mfaRequired: false });

    return res.cookie('token', token, cookieSettings).json({token: token});
}));

router.post('/mfa/disable', handleErrorAsync(async (req, res) => {
    if (!req.user || !req.user.mfa) {
        return res.status(401).json({error: 'Unauthorised'});
    }

    await disableMfa(req.db, req.user);

    const token = await issueAuthentication(req.db, req.user);

    return res.cookie('token', token, cookieSettings).json({token: token});
}));

export default router;
