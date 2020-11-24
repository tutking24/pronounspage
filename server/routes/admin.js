import { Router } from 'express';
import SQL from 'sql-template-strings';
import avatar from '../avatar';
import {config as socialLoginConfig} from "../social";
import {now, sortByValue} from "../../src/helpers";

const router = Router();

router.get('/admin/users', async (req, res) => {
    if (!req.admin) {
        return res.status(401).json({error: 'Unauthorised'});
    }

    const users = await req.db.all(SQL`
        SELECT u.id, u.username, u.email, u.roles, u.avatarSource, p.locale
        FROM users u
        LEFT JOIN profiles p ON p.userId = u.id
        ORDER BY u.roles ASC, u.id DESC
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
    if (!req.admin) {
        return res.status(401).json({error: 'Unauthorised'});
    }

    const users = {
        overall: (await req.db.get(SQL`SELECT count(*) AS c FROM users`)).c,
        admins: (await req.db.get(SQL`SELECT count(*) AS c FROM users WHERE roles=${'admin'}`)).c,
    };

    const locales = {};
    for (let locale in req.locales) {
        if (!req.locales.hasOwnProperty(locale)) { continue; }
        const profiles = await req.db.all(SQL`SELECT pronouns FROM profiles WHERE locale=${locale}`);
        const pronouns = {}
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
                pronouns[p]++;
            }
        }

        locales[locale] = {
            name: req.locales[locale].name,
            url: req.locales[locale].url,
            profiles: profiles.length,
            pronouns: sortByValue(pronouns, true),
            nouns: {
                approved: (await req.db.get(SQL`SELECT count(*) AS c FROM nouns WHERE locale=${locale} AND approved=1`)).c,
                awaiting: (await req.db.get(SQL`SELECT count(*) AS c FROM nouns WHERE locale=${locale} AND approved=0`)).c,
            }
        };
    }

    return res.json({ users, locales });
});

export default router;
