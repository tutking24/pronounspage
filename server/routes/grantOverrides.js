// grant doesn't care about the specifics of some services,
// so for some services we don't care about grant :))))

import { Router } from 'express';
import SQL from 'sql-template-strings';
import fetch from 'node-fetch';
import assert from 'assert';
import { handleErrorAsync } from "../../src/helpers";

const normalizeDomainName = (domain) => {
    const url = new URL('https://' + domain);
    assert(url.port === '');
    return url.hostname;
}

const config = {
    mastodon: {
        scopes: ['read:accounts'],
        redirect_uri: `${process.env.HOME_URL || 'https://pronouns.page'}/api/user/social/mastodon`,
    },
};

const router = Router();

const mastodonGetOAuthKeys = async (db, instance) => {
    const existingKeys = await db.get(SQL`
        SELECT client_id, client_secret
        FROM oauth_keys
        WHERE instance = ${instance}
        AND provider = 'mastodon'
    `);
    if (existingKeys) {
        return existingKeys;
    }
    const keys = await fetch(`https://${instance}/api/v1/apps`, {
        method: 'POST',
        body: new URLSearchParams({
            client_name: 'pronouns.page',
            redirect_uris: config.mastodon.redirect_uri,
            scopes: config.mastodon.scopes.join(' '),
            website: process.env.HOME_URL,
        }).toString(),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'pronouns.page',
        },
    }).then(res => res.json());
    assert(keys.client_id && keys.client_secret && !keys.error);
    db.get(SQL`
        INSERT INTO oauth_keys (instance, provider, client_id, client_secret)
        VALUES (${instance}, 'mastodon', ${keys.client_id}, ${keys.client_secret})
    `);
    return keys;
};
router.get('/connect/mastodon', handleErrorAsync(async (req, res) => {
    assert(req.query.instance);
    const instance = normalizeDomainName(req.query.instance);
    const { client_id, client_secret } = await mastodonGetOAuthKeys(req.db, instance);
    req.session.grant = { instance, client_id, client_secret };
    res.redirect(`https://${instance}/oauth/authorize?` + new URLSearchParams({
        client_id,
        scope: config.mastodon.scopes.join(' '),
        redirect_uri: config.mastodon.redirect_uri,
        response_type: 'code',
    }));
}));
router.get('/user/social/mastodon', handleErrorAsync(async (req, res, next) => {
    if (!req.session.grant || !req.session.grant.instance || !req.query.code) {
        next();
        return;
    }
    const { instance, client_id, client_secret } = req.session.grant;
    const response = await fetch(`https://${instance}/oauth/token`, {
        method: 'POST',
        body: new URLSearchParams({
            grant_type: 'authorization_code',
            client_id,
            client_secret,
            redirect_uri: config.mastodon.redirect_uri,
            scope: config.mastodon.scopes.join(' '),
            code: req.query.code,
        }).toString(),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'pronouns.page',
        },
    }).then(res => res.json());
    if (!response.access_token || response.error) {
        next();
        return;
    }
    const profile = await fetch(`https://${instance}/api/v1/accounts/verify_credentials`, {
        headers: {
            Authorization: `Bearer ${response.access_token}`,
            'User-Agent': 'pronouns.page',
        },
    }).then(res => res.json());
    response.profile = profile;
    response.instance = instance;
    req.session.grant.response = response;
    next();
    return;
}));

export default router;
