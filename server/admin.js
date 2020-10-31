import {renderJson} from "../src/helpers";

const dbConnection = require('./db');
const SQL = require('sql-template-strings');
import authenticate from './authenticate';


export default async function (req, res, next) {
    const db = await dbConnection();
    const user = authenticate(req);

    if (!user || !user.authenticated || user.roles !== 'admin') {
        return renderJson(res, {error: 'unauthorised'}, 401);
    }

    if (req.method === 'GET' && req.url === '/users') {
        const users = await db.all(SQL`
            SELECT u.id, u.username, u.email, u.roles, p.locale
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
                }
            } else {
                groupedUsers[user.id].profiles.push(user.locale);
            }
        }

        return renderJson(res, groupedUsers);
    }

    return renderJson(res, { error: 'notfound' }, 404);
}
