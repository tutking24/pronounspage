import { Router } from 'express';
import SQL from 'sql-template-strings';
import avatar from '../avatar';

const router = Router();

router.get('/admin/users', async (req, res) => {
    if (!req.admin) {
        return res.status(401).json({error: 'Unauthorised'});
    }

    const users = await req.db.all(SQL`
        SELECT u.id, u.username, u.email, u.roles, u.avatarSource, p.locale
        FROM users u
        LEFT JOIN profiles p ON p.userId = u.id
        ORDER BY u.id DESC
    `);

    const groupedUsers = {};
    for (let user of users) {
        if (groupedUsers[user.id] === undefined) {
            groupedUsers[user.id] = {
                ...user,
                locale: undefined,
                profiles: user.locale ? [user.locale] : [],
                avatar: await avatar(req.db, user),
            }
        } else {
            groupedUsers[user.id].profiles.push(user.locale);
        }
    }

    return res.json(groupedUsers);
});

export default router;
