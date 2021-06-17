import { Router } from 'express';
import SQL from 'sql-template-strings';
import avatar from '../avatar';
import {config as socialLoginConfig} from "../social";
import {buildDict, now, shuffle, handleErrorAsync} from "../../src/helpers";
import locales from '../../src/locales';
import {calculateStats, statsFile} from '../../src/stats';
import fs from 'fs';
import cache from "../../src/cache";

const router = Router();

router.get('/admin/list', handleErrorAsync(async (req, res) => {
    return res.json(await cache('main', 'admins.js', 10, async () => {
        const admins = await req.db.all(SQL`
            SELECT u.username, p.teamName, p.locale, u.id, u.email, u.avatarSource
            FROM users u
                     LEFT JOIN profiles p ON p.userId = u.id
            WHERE p.teamName IS NOT NULL
              AND p.teamName != ''
            ORDER BY RANDOM()
        `);

        const adminsGroupped = buildDict(function* () {
            yield [req.config.locale, []];
            for (let [locale, , , published] of locales) {
                if (locale !== req.config.locale && published) {
                    yield [locale, []];
                }
            }
            yield ['', []];
        });
        for (let admin of admins) {
            admin.avatar = await avatar(req.db, admin);
            delete admin.id;
            delete admin.email;

            if (adminsGroupped[admin.locale] !== undefined) {
                adminsGroupped[admin.locale].push(admin);
            } else {
                adminsGroupped[''].push(admin);
            }
        }

        return adminsGroupped;
    }));
}));

router.get('/admin/list/footer', handleErrorAsync(async (req, res) => {
    return res.json(shuffle(await cache('main', 'footer.js', 10, async () => {
        const fromDb = await req.db.all(SQL`
            SELECT u.username, p.footerName, p.footerAreas, p.locale
            FROM users u
            LEFT JOIN profiles p ON p.userId = u.id
            WHERE p.locale = ${req.config.locale}
              AND p.footerName IS NOT NULL AND p.footerName != ''
              AND p.footerAreas IS NOT NULL AND p.footerAreas != ''
        `);

        const fromConfig = req.config.contact.authors || [];

        return [...fromDb, ...fromConfig];
    })));
}));

router.get('/admin/users', handleErrorAsync(async (req, res) => {
    if (!req.isGranted('users')) {
        return res.status(401).json({error: 'Unauthorised'});
    }

    return res.json({});

    const users = await req.db.all(SQL`
        SELECT u.id, u.username, u.email, u.roles, u.avatarSource, p.locale
        FROM users u
        LEFT JOIN profiles p ON p.userId = u.id
        ORDER BY u.id DESC
    `);

    const authenticators = await req.db.all(SQL`
        SELECT userId, type FROM authenticators
        WHERE type IN (`.append(Object.keys(socialLoginConfig).map(k => `'${k}'`).join(',')).append(SQL`)
        AND (validUntil IS NULL OR validUntil > ${now()})
    `));

    const groupedUsers = {};
    for (let user of users) {
        if (groupedUsers[user.id] === undefined) {
            groupedUsers[user.id] = {
                ...user,
                locale: undefined,
                profiles: user.locale ? [user.locale] : [],
                avatar: await avatar(req.db, user),
                socialConnections: [],
            }
        } else {
            groupedUsers[user.id].profiles.push(user.locale);
        }
    }

    for (let auth of authenticators) {
        groupedUsers[auth.userId].socialConnections.push(auth.type);
    }

    return res.json(groupedUsers);
}));

router.get('/admin/stats', handleErrorAsync(async (req, res) => {
    if (!req.isGranted('panel')) {
        return res.status(401).json({error: 'Unauthorised'});
    }

    const stats = fs.existsSync(statsFile)
        ? JSON.parse(fs.readFileSync(statsFile))
        : await calculateStats(req.db, req.locales);

    for (let locale in stats.locales) {
        if (stats.locales.hasOwnProperty(locale) && !req.isGranted('panel', locale)) {
            delete stats.locales[locale];
        }
    }

    return res.json(stats);
}));

const normalise = s => s.trim().toLowerCase();

router.post('/admin/ban/:username', handleErrorAsync(async (req, res) => {
    if (!req.isGranted('users')) {
        return res.status(401).json({error: 'Unauthorised'});
    }

    await req.db.get(SQL`
        UPDATE users
        SET bannedReason = ${req.body.reason || null} 
        WHERE lower(trim(replace(replace(replace(replace(replace(replace(replace(replace(replace(username, 'Ą', 'ą'), 'Ć', 'ć'), 'Ę', 'ę'), 'Ł', 'ł'), 'Ń', 'ń'), 'Ó', 'ó'), 'Ś', 'ś'), 'Ż', 'ż'), 'Ź', 'ż'))) = ${normalise(req.params.username)}
    `);

    return res.json(true);
}));

router.get('/admin/suspicious', handleErrorAsync(async (req, res) => {
    if (!req.isGranted('users')) {
        return res.status(401).json({error: 'Unauthorised'});
    }

    return res.json(await req.db.all(SQL`
        SELECT users.id, users.username, profiles.locale FROM profiles
        LEFT JOIN users ON profiles.userId = users.id
        WHERE users.suspiciousChecked != 1
          AND users.bannedReason IS NULL
          AND (
              lower(customFlags) LIKE '%super%'
           OR lower(description) LIKE '%super%'
           OR lower(customFlags) LIKE '%phobe%'
           OR lower(description) LIKE '%phobe%'
        )
        ORDER BY users.id DESC
    `));
}));

router.post('/admin/suspicious/checked/:id', handleErrorAsync(async (req, res) => {
    if (!req.isGranted('users')) {
        return res.status(401).json({error: 'Unauthorised'});
    }

    await req.db.get(SQL`
        UPDATE users
        SET suspiciousChecked = 1
        WHERE id=${req.params.id}
    `);

    return res.json(true);
}));

export default router;
