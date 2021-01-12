import { Router } from 'express';
import SQL from 'sql-template-strings';
import avatar from '../avatar';
import {config as socialLoginConfig} from "../social";
import {buildDict, now, sortByValue} from "../../src/helpers";
import locales from '../../src/locales';

const router = Router();

router.get('/admin/list', async (req, res) => {
    const admins = await req.db.all(SQL`
        SELECT u.username, p.teamName, p.locale, u.id, u.email, u.avatarSource
        FROM users u
        LEFT JOIN profiles p ON p.userId = u.id
        WHERE p.teamName IS NOT NULL AND p.teamName != ''
        ORDER BY RANDOM()
    `);

    const adminsGroupped = buildDict(function*() {
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

    return res.json(adminsGroupped);
});

router.get('/admin/list/footer', async (req, res) => {
    return res.json(await req.db.all(SQL`
        SELECT u.username, p.footerName, p.footerAreas, p.locale
        FROM users u
        LEFT JOIN profiles p ON p.userId = u.id
        WHERE p.locale = ${req.config.locale}
          AND p.footerName IS NOT NULL AND p.footerName != ''
          AND p.footerAreas IS NOT NULL AND p.footerAreas != ''
        ORDER BY RANDOM()
    `));
});

router.get('/admin/users', async (req, res) => {
    if (!req.isGranted('users')) {
        return res.status(401).json({error: 'Unauthorised'});
    }

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
});

router.get('/admin/stats', async (req, res) => {
    if (!req.isGranted('panel')) {
        return res.status(401).json({error: 'Unauthorised'});
    }

    const users = {
        overall: (await req.db.get(SQL`SELECT count(*) AS c FROM users`)).c,
        admins: (await req.db.get(SQL`SELECT count(*) AS c FROM users WHERE roles!=''`)).c,
    };

    const locales = {};
    for (let locale in req.locales) {
        if (!req.locales.hasOwnProperty(locale)) { continue; }
        if (!req.isGranted('panel', locale)) { continue; }
        const profiles = await req.db.all(SQL`SELECT pronouns, flags FROM profiles WHERE locale=${locale}`);
        const pronouns = {}
        const flags = {}
        for (let profile of profiles) {
            const pr = JSON.parse(profile.pronouns);
            for (let pronoun in pr) {
                if (!pr.hasOwnProperty(pronoun)) { continue; }

                if (pronoun.includes(',') || pr[pronoun] < 0) {
                    continue;
                }
                const p = pronoun.replace(/^.*:\/\//, '').replace(/^\//, '').toLowerCase().replace(/^[a-z]+\.[^/]+\//, '');
                if (pronouns[p] === undefined) {
                    pronouns[p] = 0;
                }
                pronouns[p] += pr[pronoun] === 1 ? 1 : 0.5;
            }

            const fl = JSON.parse(profile.flags);
            for (let flag of fl) {
                if (flags[flag] === undefined) {
                    flags[flag] = 0;
                }
                flags[flag] += 1;
            }
        }

        locales[locale] = {
            name: req.locales[locale].name,
            url: req.locales[locale].url,
            profiles: profiles.length,
            pronouns: sortByValue(pronouns, true),
            flags: sortByValue(flags, true),
            nouns: {
                approved: (await req.db.get(SQL`SELECT count(*) AS c FROM nouns WHERE locale=${locale} AND approved=1 AND deleted=0`)).c,
                awaiting: (await req.db.get(SQL`SELECT count(*) AS c FROM nouns WHERE locale=${locale} AND approved=0 AND deleted=0`)).c,
            }
        };
    }

    return res.json({ users, locales });
});

export default router;
