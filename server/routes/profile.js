import { Router } from 'express';
import SQL from 'sql-template-strings';
import md5 from "js-md5";
import {ulid} from "ulid";
import avatar from "../avatar";
import {handleErrorAsync, now, isValidLink} from "../../src/helpers";
import { caches }  from "../../src/cache";
import fs from 'fs';
import { minBirthdate, maxBirthdate, formatDate, parseDate } from '../../src/birthdate';
import {socialProviders} from "../../src/socialProviders";
import {downgradeToV1, upgradeToV2} from "../profileV2";
import { colours, styles } from '../../src/styling';
import {normaliseUrl} from "../../src/links";
import locales from '../../src/locales';

const escapeRegExp = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // https://stackoverflow.com/a/6969486/3297012
const normalise = s => decodeURIComponent(s.trim().toLowerCase());
const normaliseWithLink = s => normalise(s.replace(/^@/, '').replace(new RegExp('^https://.*?/@'), ''))

const calcAge = birthday => {
    if (!birthday) {
        return null;
    }

    const now = new Date();
    const birth = parseDate(birthday);

    const diff = now.getTime() - birth.getTime();

    return parseInt(Math.floor(diff / 1000 / 60 / 60 / 24 / 365.25));
}

const providersWithLinks = Object.keys(socialProviders)
    .filter(p => socialProviders[p].linkRegex !== undefined);

const domains = ['https://pronouns.page', ...locales.map(l => l[2])];

const verifyLinks = (links, authenticators, username, linksMetadata) => {
    const verifiedLinks = {};
    for (let link of links) {
        const linkMetadata = linksMetadata[link];
        if (!linkMetadata || !linkMetadata.relMe) { continue; }
        for (let relMe of linkMetadata.relMe) {
            if (domains.filter(d => relMe.startsWith(d)).length === 0) { continue; }
            try {
                relMe = new URL(relMe).pathname;
            } catch { continue; }
            if (!relMe.startsWith('/@') && !relMe.startsWith('/u/')) { continue; }
            relMe = relMe.replace(new RegExp('^/@'), '').replace(new RegExp('^/u/'), '');
            if (normalise(username) === normalise(relMe)) {
                verifiedLinks[link] = 'relMe';
            }
        }
    }
    for (let provider of providersWithLinks) {
        for (let a of authenticators) {
            if (a.type !== provider) { continue; }
            const regex = new RegExp(socialProviders[a.type].linkRegex(JSON.parse(a.payload)), 'i');
            for (let link of links) {
                if (link.match(regex)) {
                    verifiedLinks[link] = provider;
                }
            }
        }
    }

    return verifiedLinks;
}

const fetchProfiles = async (db, username, self) => {
    const user = await db.get(SQL`SELECT id FROM users WHERE usernameNorm = ${normalise(username)}`);
    if (!user) {
        return {};
    }

    const profiles = await db.all(SQL`
        SELECT profiles.*
        FROM profiles
        WHERE userId = ${user.id}
        ORDER BY profiles.locale
    `);

    const linkAuthenticators = await db.all(SQL`
        SELECT a.type, a.payload
        FROM authenticators a
        WHERE a.userId = ${user.id}
        AND a.type IN (`.append(providersWithLinks.map(k => `'${k}'`).join(',')).append(SQL`)
        AND (a.validUntil IS NULL OR a.validUntil > ${now()})
    `));

    const p = {}
    for (let profile of profiles) {
        const links = JSON.parse(profile.links).map(l => normaliseUrl(l)).filter(l => !!l);
        const linksMetadata = {};
        for (let link of await db.all(SQL`SELECT * FROM links WHERE url IN (`.append(links.map(k => `'${k.replace(/'/g, "''")}'`).join(',')).append(SQL`)`))) {
            linksMetadata[link.url] = {
                favicon: link.favicon,
                relMe: JSON.parse(link.relMe),
                nodeinfo: JSON.parse(link.nodeinfo),
            };
        }
        const circle = await fetchCircles(db, profile.id, user.id);

        p[profile.locale] = {
            opinions: JSON.parse(profile.opinions),
            names: JSON.parse(profile.names),
            pronouns: JSON.parse(profile.pronouns),
            description: profile.description,
            age: calcAge(profile.birthday),
            links,
            linksMetadata,
            verifiedLinks: verifyLinks(links, linkAuthenticators, username, linksMetadata),
            flags: JSON.parse(profile.flags),
            customFlags: JSON.parse(profile.customFlags),
            words: JSON.parse(profile.words),
            birthday: self ? profile.birthday : undefined,
            timezone: profile.timezone ? JSON.parse(profile.timezone) : null,
            teamName: profile.teamName,
            footerName: profile.footerName,
            footerAreas: profile.footerAreas ? profile.footerAreas.split(',') : [],
            credentials: profile.credentials ? profile.credentials.split('|') : [],
            credentialsLevel: profile.credentialsLevel,
            credentialsName: profile.credentialsName,
            card: profile.card,
            cardDark: profile.cardDark,
            circle,
            sensitive: JSON.parse(profile.sensitive),
        };
    }
    return p;
};

export const profilesSnapshot = async (db, username) => {
    return JSON.stringify(await fetchProfiles(db, username, true), null, 4);
}

const susRegexes = fs.readFileSync(__dirname + '/../../moderation/sus.txt').toString('utf-8').split('\n').filter(x => !!x);

function* isSuspicious(profile) {
    for (let s of [
        profile.description,
        JSON.stringify(profile.customFlags),
        JSON.stringify(profile.pronouns),
        JSON.stringify(profile.names),
        JSON.stringify(profile.words),
        JSON.stringify(profile.opinions),
        JSON.stringify(profile.circle),
    ]) {
        s = s.toLowerCase().replace(/\s+/g, ' ');
        for (let sus of susRegexes) {
            let m = s.match(new RegExp(sus, 'ig'));
            if (m) {
                yield `${m[0]} (${sus})`;
            }
        }
    }
}

const hasAutomatedReports = async (db, id) => {
    return (await db.get(SQL`SELECT COUNT(*) AS c FROM reports WHERE userId = ${id} AND isAutomatic = 1`)).c > 0;
}

const usernamesToIds = async(db, usernames) => {
    const users = await db.all(SQL`
        SELECT id, usernameNorm
        FROM users
        WHERE users.usernameNorm IN (`.append(usernames.map(k => `'${normaliseWithLink(k)}'`).join(',')).append(SQL`)`
    ));

    const idMap = {}
    for (let username of usernames) {
        for (let {id, usernameNorm} of users) {
            if (normaliseWithLink(username) === usernameNorm) {
                idMap[normaliseWithLink(username)] = id;
            }
        }
    }

    return idMap;
}

const selectBestLocale = (availableLocales) => {
    if (availableLocales.length === 1) {
        return availableLocales[0];
    }

    if (availableLocales.includes(config.locale)) {
        return config.locale;
    }

    return '_';
}

const fetchCircles = async(db, profileId, userId) => {
    const connections = await db.all(SQL`
        SELECT u.id, u.username, u.avatarSource, u.email, p.locale, c.relationship
        FROM user_connections c
            LEFT JOIN users u ON u.id = c.to_userId
            LEFT JOIN profiles p ON p.userId = u.id
        WHERE from_profileId = ${profileId}
        ORDER BY c.id
    `);

    const mentions = await findCircleMentions(db, userId);

    const circle = {};

    for (let connection of connections) {
        if (!circle.hasOwnProperty(connection.username)) {
            circle[connection.username] = {
                username: connection.username,
                avatar: await avatar(db, connection),
                circleMutual: mentions[connection.username] !== undefined,
                locale: [],
                relationship: connection.relationship,
            };
        }
        circle[connection.username].locale.push(connection.locale);
    }

    for (let id in circle) {
        if (!circle.hasOwnProperty(id)) { continue; }
        circle[id].locale = selectBestLocale(circle[id].locale);
    }

    return Object.values(circle);
}

const router = Router();

const fetchProfilesRoute = async (req, res, user) => {
    const isSelf = req.user && req.user.username === req.params.username;
    const isAdmin = req.isGranted('users');

    if (!user || (user.bannedReason !== null && !isAdmin && !isSelf)) {
        return res.json({
            profiles: {},
        });
    }

    user.emailHash = md5(user.email);
    delete user.email;
    user.avatar = await avatar(req.db, user);

    user.bannedTerms = user.bannedTerms ? user.bannedTerms.split(',') : [];

    let profiles = await fetchProfiles(req.db, user.username, isSelf);
    if (req.query.version !== '2') {
        for (let [locale, profile] of Object.entries(profiles)) {
            profiles[locale] = downgradeToV1(profile);
        }
    }

    return res.json({
        ...user,
        profiles,
    });
}

router.get('/profile/get/:username', handleErrorAsync(async (req, res) => {
    const user = await req.db.get(SQL`
        SELECT
            users.id,
            users.username,
            users.email,
            users.avatarSource,
            users.bannedReason,
            users.bannedTerms,
            users.bannedBy,
            users.roles != '' AS team
        FROM users
        WHERE users.usernameNorm = ${normalise(req.params.username)}
    `);

    return await fetchProfilesRoute(req, res, user);
}));

router.get('/profile/get-id/:id', handleErrorAsync(async (req, res) => {
    const user = await req.db.get(SQL`
        SELECT
            users.id,
            users.username,
            users.email,
            users.avatarSource,
            users.bannedReason,
            users.bannedTerms,
            users.bannedBy,
            users.roles != '' AS team
        FROM users
        WHERE users.id = ${req.params.id}
    `);

    return await fetchProfilesRoute(req, res, user);
}));

router.get('/profile/versions/:username', handleErrorAsync(async (req, res) => {
    return res.json((await req.db.all(SQL`
        SELECT
            profiles.locale
        FROM users
            LEFT JOIN profiles ON profiles.userId = users.id
        WHERE users.usernameNorm = ${normaliseWithLink(req.params.username)}
    `)).map(x => x.locale));
}));

const findCircleMentions = async (db, userId) => {
    const mentionsRaw = await db.all(SQL`
        SELECT
            u.username, p.locale, c.relationship
        FROM user_connections c
            LEFT JOIN profiles p ON p.id = c.from_profileId
            LEFT JOIN users u ON u.id = p.userId
        WHERE c.to_userId = ${userId}
    `);

    const mentionsGrouped = {};
    for (let {username, locale, relationship} of mentionsRaw) {
        if (!mentionsGrouped.hasOwnProperty(username)) {
            mentionsGrouped[username] = {};
        }

        mentionsGrouped[username][locale] = relationship;
    }

    return mentionsGrouped;
}

router.get('/profile/my-circle-mentions', handleErrorAsync(async (req, res) => {
    if (!req.user) {
        return res.status(401).json({error: 'Unauthorised'});
    }

    return res.json(await findCircleMentions(req.db, req.user.id));
}));

const cleanupBirthday = (bd) => {
    if (!bd) { return null; }
    const match = bd.match(/^(\d\d\d\d)-(\d\d)-(\d\d)$/);
    if (!match) { return null; }

    bd = new Date(parseInt(match[1]), parseInt(match[2]) - 1, parseInt(match[3]));
    if (bd < minBirthdate || bd > maxBirthdate) {
        return null;
    }

    return formatDate(bd);
}

const cleanupOpinions = (opinions) => {
    const cleanOpinions = {}
    for (let opinion of opinions) {
        if (!opinion.icon || !opinion.description) { continue; }
        cleanOpinions[opinion.icon] = {
            icon: opinion.icon,
            description: opinion.description.substring(0, 24),
            colour: opinion.colour && colours.includes(opinion.colour) ? opinion.colour : undefined,
            style: opinion.style && styles.includes(opinion.style) ? opinion.style : undefined,
        }
    }
    return cleanOpinions;
}

router.post('/profile/save', handleErrorAsync(async (req, res) => {
    if (!req.user) {
        return res.status(401).json({error: 'Unauthorised'});
    }

    if (!Array.isArray(req.body.names)) {
        // service worker cache sends v1 requests
        req.body = upgradeToV2(req.body);
    }

    if (!Array.isArray(req.body.customFlags)) {
        // no idea WTF is happening here, but somehow we got values like {"0": ..., "1": ..., ...}
        req.body.customFlags = Object.values(req.body.customFlags);
    }

    if (req.body.opinions.length > 5
        || req.body.names.length > 128
        || req.body.pronouns.length > 128
        || req.body.links.length > 128
        || req.body.customFlags.length > 128
        || req.body.circle.length > 16
        || req.body.words.filter(c => c.values.length > 64).length > 0
        || req.body.sensitive.length > 16
    ) {
        return res.status(400).json({error: 'crud.validation.genericForm'});
    }

    const opinions = cleanupOpinions(req.body.opinions);
    const names = req.body.names.map(p => { return {...p, value: p.value.substring(0, 32)}});
    const pronouns = req.body.pronouns.map(p => { return {...p, value: p.value.substring(0, 192)}});
    const description = req.body.description.substring(0, 256);
    const birthday = cleanupBirthday(req.body.birthday || null);
    const links = req.body.links.filter(x => !!x && isValidLink(x));
    const customFlags = req.body.customFlags.filter(x => x.name && (!x.link || isValidLink(x.link))).map(x => {
        return {
            value: x.value,
            name: x.name.substring(0, 24),
            description: x.description ? x.description.substring(0, 512) : null,
            alt: x.alt ? x.alt.substring(0, 512) : null,
            link: x.link ? normaliseUrl(x.link) : null,
        }
    });
    const words = req.body.words.map(c => { return {...c, values: c.values.map(p => { return {...p, value: p.value.substring(0, 32)}})}});
    const sensitive = req.body.sensitive.filter(x => !!x).map(x => x.substring(0, 64));
    const timezone = req.body.timezone ? {
        tz: req.body.timezone.tz,
        area: req.body.timezone.area,
        loc: req.body.timezone.loc,
    } : null;

    // TODO just make it a transaction...
    const ids = (await req.db.all(SQL`SELECT * FROM profiles WHERE userId = ${req.user.id} AND locale = ${global.config.locale}`)).map(row => row.id);
    let profileId;
    if (ids.length) {
        profileId = ids[0];
        await req.db.get(SQL`UPDATE profiles
            SET
                opinions = ${JSON.stringify(opinions)},
                names = ${JSON.stringify(names)},
                pronouns = ${JSON.stringify(pronouns)},
                description = ${description},
                birthday = ${birthday},
                timezone = ${JSON.stringify(timezone)},
                links = ${JSON.stringify(links)},
                flags = ${JSON.stringify(req.body.flags)},
                customFlags = ${JSON.stringify(customFlags)},
                words = ${JSON.stringify(words)},
                sensitive = ${JSON.stringify(sensitive)},
                teamName = ${req.isGranted() ? req.body.teamName || null : ''},
                footerName = ${req.isGranted() ? req.body.footerName || null : ''},
                footerAreas = ${req.isGranted() ? req.body.footerAreas.join(',') || null : ''},
                credentials = ${req.isGranted() ? req.body.credentials.join('|') || null : null},
                credentialsLevel = ${req.isGranted() ? req.body.credentialsLevel || null : null},
                credentialsName = ${req.isGranted() ? req.body.credentialsName || null : null},
                card = NULL,
                cardDark = NULL
            WHERE id = ${profileId}
        `);
    } else {
        profileId = ulid();
        await req.db.get(SQL`INSERT INTO profiles (id, userId, locale, opinions, names, pronouns, description, birthday, timezone, links, flags, customFlags, words, sensitive, active, teamName, footerName, footerAreas)
            VALUES (${profileId}, ${req.user.id}, ${global.config.locale},
                    ${JSON.stringify(opinions)},
                    ${JSON.stringify(names)},
                    ${JSON.stringify(pronouns)},
                    ${description},
                    ${birthday},
                    ${JSON.stringify(timezone)},
                    ${JSON.stringify(links)},
                    ${JSON.stringify(req.body.flags)},
                    ${JSON.stringify(customFlags)},
                    ${JSON.stringify(words)},
                    ${JSON.stringify(sensitive)},
                    1,
                    ${req.isGranted() ? req.body.teamName || null : ''},
                    ${req.isGranted() ? req.body.footerName || null : ''},
                    ${req.isGranted() ? req.body.footerAreas.join(',') || null : ''}
        )`);
    }

    await req.db.get(SQL`DELETE FROM user_connections WHERE from_profileId = ${profileId}`);
    const usernameIdMap = await usernamesToIds(req.db, req.body.circle.map(r => r.username));
    for (let connection of req.body.circle) {
        const toUserId = usernameIdMap[normaliseWithLink(connection.username)];
        const relationship = connection.relationship.substring(0, 64).trim();
        if (toUserId === undefined || !relationship) { continue; }
        await req.db.get(SQL`INSERT INTO user_connections (id, from_profileId, to_userId, relationship) VALUES (
            ${ulid()},
            ${profileId},
            ${toUserId},
            ${relationship}
        )`);
    }

    if ((req.body.propagate || []).includes('teamName')) {
        await req.db.get(SQL`UPDATE profiles
            SET teamName = ${req.isGranted() ? req.body.teamName || null : ''}
            WHERE userId = ${req.user.id} AND teamName != '' AND teamName IS NOT NULL;
        `);
    }

    if ((req.body.propagate || []).includes('footerName')) {
        await req.db.get(SQL`UPDATE profiles
            SET footerName = ${req.isGranted() ? req.body.footerName || null : ''}
            WHERE userId = ${req.user.id} AND footerName != '' AND footerName IS NOT NULL;
        `);
    }

    if ((req.body.propagate || []).includes('names')) {
        await req.db.get(SQL`UPDATE profiles
            SET names = ${JSON.stringify(req.body.names)}
            WHERE userId = ${req.user.id};
        `);
    }

    if ((req.body.propagate || []).includes('flags')) {
        await req.db.get(SQL`UPDATE profiles
            SET flags = ${JSON.stringify(req.body.flags)}
            WHERE userId = ${req.user.id};
        `);
    }

    if ((req.body.propagate || []).includes('customFlags')) {
        await req.db.get(SQL`UPDATE profiles
            SET customFlags = ${JSON.stringify(req.body.customFlags)}
            WHERE userId = ${req.user.id};
        `);
    }

    if ((req.body.propagate || []).includes('links')) {
        await req.db.get(SQL`UPDATE profiles
            SET links = ${JSON.stringify(req.body.links.filter(x => !!x))}
            WHERE userId = ${req.user.id};
        `);
    }

    if ((req.body.propagate || []).includes('links')) {
        await req.db.get(SQL`UPDATE profiles
            SET links = ${JSON.stringify(req.body.links.filter(x => !!x))}
            WHERE userId = ${req.user.id};
        `);
    }

    if ((req.body.propagate || []).includes('birthday')) {
        await req.db.get(SQL`UPDATE profiles
            SET birthday = ${cleanupBirthday(req.body.birthday || null)}
            WHERE userId = ${req.user.id};
        `);
    }

    if ((req.body.propagate || []).includes('timezone')) {
        await req.db.get(SQL`UPDATE profiles
            SET timezone = ${JSON.stringify(timezone)}
            WHERE userId = ${req.user.id};
        `);
    }

    for (let url of links) {
        url = normaliseUrl(url);
        if (!url) { continue; }
        await req.db.get(SQL`INSERT INTO links (url) VALUES (${url}) ON CONFLICT (url) DO UPDATE SET expiresAt = null`);
    }

    const sus = [...isSuspicious(req.body)];
    if (sus.length && !await hasAutomatedReports(req.db, req.user.id)) {
        await req.db.get(SQL`
            INSERT INTO reports (id, userId, reporterId, isAutomatic, comment, isHandled, snapshot)
            VALUES (${ulid()}, ${req.user.id}, null, 1, ${sus.join(', ')}, 0, ${await profilesSnapshot(req.db, normalise(req.user.username))});
        `);
    }

    if (req.body.teamName) {
        await caches.admins.invalidate();
        await caches.adminsFooter.invalidate();
    }

    await req.db.get(SQL`UPDATE users SET inactiveWarning = null WHERE id = ${req.user.id}`);

    return res.json(await fetchProfiles(req.db, req.user.username, true));
}));

router.post('/profile/delete/:locale', handleErrorAsync(async (req, res) => {
    await req.db.get(SQL`DELETE FROM profiles WHERE userId = ${req.user.id} AND locale = ${req.params.locale}`);

    return res.json(await fetchProfiles(req.db, req.user.username, true));
}));

router.post('/profile/report/:username', handleErrorAsync(async (req, res) => {
    const user = await req.db.get(SQL`SELECT id FROM users WHERE usernameNorm = ${normalise(req.params.username)}`);
    if (!user) {
        return res.status(400).json({error: 'Missing user'});
    }
    if (!req.body.comment) {
        return res.status(400).json({error: 'Missing comment'});
    }

    await req.db.get(SQL`
        INSERT INTO reports (id, userId, reporterId, isAutomatic, comment, isHandled, snapshot)
        VALUES (${ulid()}, ${user.id}, ${req.user.id}, 0, ${req.body.comment}, 0, ${await profilesSnapshot(req.db, normalise(req.params.username))});
    `);

    return res.json('OK');
}));

router.post('/profile/request-card', handleErrorAsync(async (req, res) => {
    if (!req.user) {
        return res.status(400).json({error: 'Missing user'});
    }

    if (req.query.dark === '1') {
        await req.db.get(SQL`
            UPDATE profiles
            SET cardDark = ''
            WHERE userId=${req.user.id} AND locale=${global.config.locale} AND cardDark IS NULL
        `);
    } else {
        await req.db.get(SQL`
            UPDATE profiles
            SET card = ''
            WHERE userId=${req.user.id} AND locale=${global.config.locale} AND card IS NULL
        `);
    }

    return res.json('OK');
}));

router.get('/profile/has-card', handleErrorAsync(async (req, res) => {
    if (!req.user) {
        return res.status(400).json({error: 'Missing user'});
    }

    const card = await req.db.get(SQL`
        SELECT card, cardDark
        FROM profiles
        WHERE userId=${req.user.id} AND locale=${global.config.locale}
    `);

    return res.json(card);
}));

router.post('/profile/remove-self-circle/:username', handleErrorAsync(async (req, res) => {
    if (!req.user) {
        return res.status(401).json({error: 'Unauthorised'});
    }
    const user = await req.db.get(SQL`SELECT id FROM users WHERE usernameNorm = ${normalise(req.params.username)}`);
    if (!user) {
        return res.status(400).json({error: 'Missing user'});
    }

    await req.db.get(SQL`
        DELETE FROM user_connections WHERE to_userId = ${req.user.id} AND from_profileId IN (
            SELECT id FROM profiles WHERE userId = ${user.id}
        )
    `);

    return res.json('OK');
}));

export default router;
