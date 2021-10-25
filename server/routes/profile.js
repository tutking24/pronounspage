import { Router } from 'express';
import SQL from 'sql-template-strings';
import md5 from "js-md5";
import {ulid} from "ulid";
import avatar from "../avatar";
import {handleErrorAsync} from "../../src/helpers";
import { caches }  from "../../src/cache";

const normalise = s => s.trim().toLowerCase();

const calcAge = birthday => {
    if (!birthday) {
        return null;
    }

    const now = new Date();
    const birth = new Date(
        parseInt(birthday.substring(0, 4)),
        parseInt(birthday.substring(5, 7)) - 1,
        parseInt(birthday.substring(8, 10))
    );

    const diff = now.getTime() - birth.getTime();

    return parseInt(Math.floor(diff / 1000 / 60 / 60 / 24 / 365.25));
}

const prepareProfile = (profile, isSelf) => {
    return {
        names: JSON.parse(profile.names),
        pronouns: JSON.parse(profile.pronouns),
        description: profile.description,
        age: calcAge(profile.birthday),
        links: JSON.parse(profile.links),
        flags: JSON.parse(profile.flags),
        customFlags: JSON.parse(profile.customFlags),
        words: JSON.parse(profile.words),
        birthday: isSelf ? profile.birthday : undefined,
        teamName: profile.teamName,
        footerName: profile.footerName,
        footerAreas: profile.footerAreas ? profile.footerAreas.split(',') : [],
        credentials: profile.credentials ? profile.credentials.split('|') : [],
        credentialsLevel: profile.credentialsLevel,
        credentialsName: profile.credentialsName,
        card: profile.card,
        cardDark: profile.cardDark,
    };
}

const fetchProfiles = async (db, username, isSelf) => {
    const profiles = await db.all(SQL`
        SELECT profiles.* FROM profiles LEFT JOIN usernames on usernames.id == profiles.usernameId 
        WHERE usernames.usernameNorm = ${normalise(username)}
        ORDER BY profiles.locale
    `);

    const p = {}
    for (let profile of profiles) {
        p[profile.locale] = prepareProfile(profile, isSelf);
    }
    return p;
};

function* isSuspicious(profile) {
    const description = profile.description.toLowerCase();
    const flags = JSON.stringify(profile.customFlags).toLowerCase();
    const pronouns = JSON.stringify(profile.pronouns).toLowerCase();

    if (description.includes('superstr') || description.includes('superhet') || description.includes('super-') ||
        flags.includes('superstr') || flags.includes('superhet') || flags.includes('super-')
    ) {
        yield 'Superstraight';
    }

    if (description.includes('phobe') || description.includes('phobic') ||
        flags.includes('phobe') || flags.includes('phobic')
    ) {
        yield '-phobic';
    }

    if (description.includes('terf') || description.includes('radfem') || description.includes('gender critical') ||
        flags.includes('terf') || flags.includes('radfem') || flags.includes('gender critical')
    ) {
        yield 'TERF';
    }

    if (description.includes('helicopter') ||
        flags.includes('helicopter') ||
        pronouns.includes('helicopter')
    ) {
        yield 'Helicopter';
    }

    if (pronouns.includes('nor/mal')
    ) {
        yield 'nor/mal';
    }

    if (description.includes('pedophile') ||
        flags.includes('pedophile') ||
        description.includes('lolicon') ||
        flags.includes('lolicon') ||
        profile.description.match(/\bMAP\b/) ||
        JSON.stringify(profile.customFlags).match(/\bMAP\b/)
    ) {
        yield 'Pedophile';
    }
}

const hasAutomatedReports = async (db, id) => {
    return (await db.get(SQL`SELECT COUNT(*) AS c FROM reports WHERE userId = ${id} AND isAutomatic = 1`)).c > 0;
}

const router = Router();

router.get('/profile/get-all/:id', handleErrorAsync(async (req, res) => {
    const isSelf = req.user && req.user.id === req.params.id;
    const isAdmin = req.isGranted('users');
    if (!isAdmin && !isSelf) {
        return res.status(401).json({error: 'Unauthorised'});
    }

    const user = await req.db.get(SQL`
        SELECT u.id, u.email, u.bannedReason, u.bannedTerms, u.roles != '' AS team
        FROM users u
        WHERE u.id = ${req.params.id}
    `);

    if (!user) {
        return res.status(404).json({error: 'Not Found'});
    }

    user.bannedTerms = user.bannedTerms ? user.bannedTerms.split(',') : [];

    const usernames = await req.db.all(SQL`
        SELECT n.id, n.username, n.avatarSource
        FROM usernames n
        WHERE n.userId = ${req.params.id}
    `);

    const profiles = await req.db.all(SQL`
        SELECT p.*
        FROM profiles p
        WHERE p.usernameId IN (`.append(usernames.map(n => `'` + n.id + `'`).join(',')).append(SQL`)
    `));

    const u = {}
    for (let username of usernames) {
        u[username.id] = {
            username: username.username,
            avatarSource: username.avatarSource,
            avatar: await avatar(req.db, {...username, id: user.id, emailHash: md5(user.email)}),
            profiles: {},
        }
    }

    for (let profile of profiles) {
        u[profile.usernameId].profiles[profile.locale] = prepareProfile(profile, isSelf);
    }

    return res.json({
        ...user,
        usernames: u,
    });
}));

router.get('/profile/get/:username', handleErrorAsync(async (req, res) => {
    const user = await req.db.get(SQL`
        SELECT
            u.bannedReason,
            u.bannedTerms,
            u.roles != '' AS team
        FROM usernames n
        LEFT JOIN users u ON n.userId = u.id
        WHERE n.usernameNorm = ${normalise(req.params.username)}
    `);

    const isSelf = req.user && req.user.id === user.id;
    const isAdmin = req.isGranted('users');

    if (!user || (user.bannedReason !== null && !isAdmin && !isSelf)) {
        return res.json({
            profiles: {},
        });
    }

    user.bannedTerms = user.bannedTerms ? user.bannedTerms.split(',') : [];

    return res.json({
        ...user,
        profiles: await fetchProfiles(req.db, req.params.username, isSelf),
    });
}));

router.post('/profile/save', handleErrorAsync(async (req, res) => {
    if (!req.user) {
        return res.status(401).json({error: 'Unauthorised'});
    }

    // TODO just make it a transaction...
    const ids = (await req.db.all(SQL`
        SELECT * FROM profiles
        WHERE userId = ${req.user.id}
          AND locale = ${global.config.locale}
    `)).map(row => row.id);
    if (ids.length) {
        await req.db.get(SQL`UPDATE profiles
            SET
                names = ${JSON.stringify(req.body.names)},
                pronouns = ${JSON.stringify(req.body.pronouns)},
                description = ${req.body.description},
                birthday = ${req.body.birthday || null},
                links = ${JSON.stringify(req.body.links.filter(x => !!x))},
                flags = ${JSON.stringify(req.body.flags)},
                customFlags = ${JSON.stringify(req.body.customFlags)},
                words = ${JSON.stringify(req.body.words)},
                teamName = ${req.isGranted() ? req.body.teamName || null : ''},
                footerName = ${req.isGranted() ? req.body.footerName || null : ''},
                footerAreas = ${req.isGranted() ? req.body.footerAreas.join(',') || null : ''},
                credentials = ${req.isGranted() ? req.body.credentials.join('|') || null : null},
                credentialsLevel = ${req.isGranted() ? req.body.credentialsLevel || null : null},
                credentialsName = ${req.isGranted() ? req.body.credentialsName || null : null},
                card = NULL
            WHERE id = ${ids[0]}
        `);
    } else {
        await req.db.get(SQL`INSERT INTO profiles (id, userId, locale, names, pronouns, description, birthday, links, flags, customFlags, words, active, teamName, footerName, footerAreas)
            VALUES (${ulid()}, ${req.user.id}, ${global.config.locale}, ${JSON.stringify(req.body.names)}, ${JSON.stringify(req.body.pronouns)},
                ${req.body.description}, ${req.body.birthday || null}, ${JSON.stringify(req.body.links.filter(x => !!x))}, ${JSON.stringify(req.body.flags)}, ${JSON.stringify(req.body.customFlags)},
                ${JSON.stringify(req.body.words)}, 1,
                ${req.isGranted() ? req.body.teamName || null : ''},
                ${req.isGranted() ? req.body.footerName || null : ''},
                ${req.isGranted() ? req.body.footerAreas.join(',') || null : ''}
        )`);
    }

    const sus = [...isSuspicious(req.body)];
    if (sus.length && !await hasAutomatedReports(req.db, req.user.id)) {
        await req.db.get(SQL`
            INSERT INTO reports (id, userId, reporterId, isAutomatic, comment, isHandled)
            VALUES (${ulid()}, ${req.user.id}, null, 1, ${sus.join(', ')}, 0);
        `);
    }

    if (req.body.teamName) {
        await caches.admins.invalidate();
        await caches.adminsFooter.invalidate();
    }

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
        INSERT INTO reports (id, userId, reporterId, isAutomatic, comment, isHandled)
        VALUES (${ulid()}, ${user.id}, ${req.user.id}, 0, ${req.body.comment}, 0);
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

export default router;
