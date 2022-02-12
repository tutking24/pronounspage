import { Router } from 'express';
import SQL from 'sql-template-strings';
import avatar from '../avatar';
import {buildDict, now, shuffle, handleErrorAsync} from "../../src/helpers";
import locales from '../../src/locales';
import {calculateStats, statsFile} from '../../src/stats';
import fs from 'fs';
import { caches }  from "../../src/cache";
import mailer from "../../src/mailer";
import {profilesSnapshot} from "./profile";
import buildLocaleList from "../../src/buildLocaleList";
import {archiveBan, liftBan} from "../ban";

const router = Router();

router.get('/admin/list', handleErrorAsync(async (req, res) => {
    return res.json(await caches.admins.fetch(async () => {
        const admins = await req.db.all(SQL`
            SELECT u.username, p.teamName, p.locale, u.id, u.email, u.avatarSource, p.credentials, p.credentialsLevel, p.credentialsName, a.payload
            FROM users u
                LEFT JOIN profiles p ON p.userId = u.id
                LEFT JOIN authenticators a ON u.id = a.userId AND a.type = u.avatarSource AND (a.validUntil IS NULL OR a.validUntil > ${now()}) 
            WHERE p.teamName IS NOT NULL
              AND p.teamName != ''
            ORDER BY RANDOM()
        `);

        const adminsGroupped = buildDict(function* () {
            yield [global.config.locale, []];
            for (let [locale, , , published] of locales) {
                if (locale !== global.config.locale && published) {
                    yield [locale, []];
                }
            }
            yield ['', []];
        });
        for (let admin of admins) {
            admin.avatar = await avatar(req.db, admin);
            delete admin.id;
            delete admin.email;
            delete admin.payload;
            if (admin.credentials) {
                admin.credentials = admin.credentials.split('|');
            }

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
    return res.json(shuffle(await caches.adminsFooter.fetch(async () => {
        const fromDb = await req.db.all(SQL`
            SELECT u.username, p.footerName, p.footerAreas, p.locale
            FROM users u
            LEFT JOIN profiles p ON p.userId = u.id
            WHERE p.locale = ${global.config.locale}
              AND p.footerName IS NOT NULL AND p.footerName != ''
              AND p.footerAreas IS NOT NULL AND p.footerAreas != ''
        `);

        const fromConfig = global.config.contact.authors || [];

        return [...fromDb, ...fromConfig];
    })));
}));

router.get('/admin/users', handleErrorAsync(async (req, res) => {
    if (!req.isGranted('users')) {
        return res.status(401).json({error: 'Unauthorised'});
    }

    const conditions = [];

    let sql = SQL`
        SELECT u.id, u.username, u.email, u.roles, u.avatarSource, group_concat(p.locale) AS profiles
        FROM users u
        LEFT JOIN profiles p ON p.userId = u.id
    `

    if (req.query.filter) {
        conditions.push(SQL`u.username LIKE ${'%' + req.query.filter + '%'}`);
    }
    if (req.query.localeFilter) {
        conditions.push(SQL`p.locale=${global.config.locale}`);
    }
    if (req.query.adminsFilter) {
        conditions.push(SQL`u.roles != ''`);
    }

    let conditionsSql = SQL``;
    if (conditions.length) {
        let i = 0;
        for (let condition of conditions) {
            conditionsSql = conditionsSql.append(i++ ? SQL` AND ` : SQL` WHERE `).append(condition);
        }
    }

    sql = sql.append(conditionsSql).append(SQL`
        GROUP BY u.id
        ORDER BY u.id DESC
        LIMIT ${parseInt(req.query.limit || 100)}
        OFFSET ${parseInt(req.query.offset || 0)}
    `);

    const countSql = SQL`SELECT COUNT(*) AS c FROM (SELECT u.id FROM users u LEFT JOIN profiles p ON p.userId = u.id`.append(conditionsSql).append(` GROUP BY u.id)`);

    return res.json({
        count: (await req.db.get(countSql)).c,
        data: (await req.db.all(sql)).map(u => {
            u.profiles = u.profiles ? u.profiles.split(',') : [];
            return u;
        }),
    });
}));

router.get('/admin/stats', handleErrorAsync(async (req, res) => {
    if (!req.isGranted('panel')) {
        return res.status(401).json({error: 'Unauthorised'});
    }

    const stats = fs.existsSync(statsFile)
        ? JSON.parse(fs.readFileSync(statsFile))
        : await calculateStats(req.db, buildLocaleList(global.config.locale));

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

    const user = await req.db.get(SQL`SELECT id, email FROM users WHERE usernameNorm = ${normalise(req.params.username)}`);
    if (!user) {
        return res.status(400).json({error: 'No such user'});
    }

    if (req.body.reason) {
        if (!req.body.terms.length) {
            return res.status(400).json({error: 'Terms are required'});
        }
        await req.db.get(SQL`
            UPDATE users
            SET bannedReason = ${req.body.reason},
                bannedTerms = ${req.body.terms.join(',')},
                bannedBy = ${req.user.id},
                banSnapshot = ${await profilesSnapshot(req.db, normalise(req.params.username))}
            WHERE id = ${user.id}
        `);
        await archiveBan(req.db, user);
        mailer(user.email, 'ban', {reason: req.body.reason});
    } else {
        await req.db.get(SQL`
            UPDATE users
            SET bannedReason = null
            WHERE id = ${user.id}
        `);
        await liftBan(req.db, user);
    }

    await req.db.get(SQL`
        UPDATE reports
        SET isHandled = 1 
        WHERE userId = ${user.id}
    `);

    return res.json(true);
}));

router.get('/admin/reports', handleErrorAsync(async (req, res) => {
    if (!req.isGranted('users')) {
        return res.status(401).json({error: 'Unauthorised'});
    }

    return res.json(await req.db.all(SQL`
        SELECT reports.id, sus.username AS susUsername, reporter.username AS reporterUsername, reports.comment, reports.isAutomatic, reports.isHandled
        FROM reports
        LEFT JOIN users sus ON reports.userId = sus.id
        LEFT JOIN users reporter ON reports.reporterId = reporter.id
        ORDER BY reports.isHandled ASC, reports.id DESC
    `));
}));

router.post('/admin/reports/handle/:id', handleErrorAsync(async (req, res) => {
    if (!req.isGranted('users')) {
        return res.status(401).json({error: 'Unauthorised'});
    }

    await req.db.get(SQL`
        UPDATE reports
        SET isHandled = 1
        WHERE id=${req.params.id}
    `);

    return res.json(true);
}));

export default router;
