const dbConnection = require('./db');
const SQL = require('sql-template-strings');
import {buildDict, renderJson} from "../src/helpers";
import { ulid } from 'ulid'
import authenticate from './authenticate';
import md5 from 'js-md5';

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

const buildProfile = profile => {
    return {
        id: profile.id,
        userId: profile.userId,
        username: profile.username,
        emailHash: md5(profile.email),
        names: JSON.parse(profile.names),
        pronouns: JSON.parse(profile.pronouns),
        description: profile.description,
        age: calcAge(profile.birthday),
        links: JSON.parse(profile.links),
        flags: JSON.parse(profile.flags),
        words: JSON.parse(profile.words),
    };
};

const fetchProfiles = async (db, res, username, self) => {
    const profiles = await db.all(SQL`
        SELECT profiles.*, users.username, users.email FROM profiles LEFT JOIN users on users.id == profiles.userId 
        WHERE users.username = ${username}
        AND profiles.active = 1
        ORDER BY profiles.locale
    `);

    return renderJson(res, buildDict(function* () {
        for (let profile of profiles) {
            yield [
                profile.locale,
                {
                    ...buildProfile(profile),
                    birthday: self ? profile.birthday : undefined,
                }
            ];
        }
    }));
}

export default async function (req, res, next) {
    const db = await dbConnection();
    const user = authenticate(req);

    if (req.method === 'GET' && req.url.startsWith('/get/')) {
        const username = req.url.substring(5);
        return await fetchProfiles(db, res, username, user && user.authenticated && user.username === username)
    }

    if (!user || !user.authenticated) {
        return renderJson(res, {error: 'unauthorised'}, 401);
    }

    if (req.method === 'POST' && req.url.startsWith('/save/')) {
        const locale = req.url.substring(6);
        const userId = (await db.get(SQL`SELECT id FROM users WHERE username = ${user.username}`)).id;

        await db.get(SQL`DELETE FROM profiles WHERE userId = ${userId} AND locale = ${locale}`);
        await db.get(SQL`INSERT INTO profiles (id, userId, locale, names, pronouns, description, birthday, links, flags, words, active)
            VALUES (${ulid()}, ${userId}, ${locale}, ${JSON.stringify(req.body.names)}, ${JSON.stringify(req.body.pronouns)},
                    ${req.body.description}, ${req.body.birthday || null}, ${JSON.stringify(req.body.links)}, ${JSON.stringify(req.body.flags)},
                    ${JSON.stringify(req.body.words)}, 1
        )`);

        return fetchProfiles(db, res, user.username, true);
    }

    if (req.method === 'POST' && req.url.startsWith('/delete/')) {
        const locale = req.url.substring(8);
        const userId = (await db.get(SQL`SELECT id FROM users WHERE username = ${user.username}`)).id;

        await db.get(SQL`DELETE FROM profiles WHERE userId = ${userId} AND locale = ${locale}`);

        return fetchProfiles(db, res, user.username, true);
    }

    return renderJson(res, { error: 'notfound' }, 404);
}
