import { Router } from 'express';
import SQL from 'sql-template-strings';
import avatar from '../avatar';
import {config as socialLoginConfig} from "../social";
import {now} from "../../src/helpers";

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

export default router;
