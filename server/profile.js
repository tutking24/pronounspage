const dbConnection = require('./db');
const SQL = require('sql-template-strings');
import {buildDict, render} from "../src/helpers";
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

export default async function (req, res, next) {
    const db = await dbConnection();
    const user = authenticate(req);


    if (req.method === 'GET' && req.url.startsWith('/get/')) {
        const profiles = await db.all(SQL`
            SELECT profiles.*, users.username, users.email FROM profiles LEFT JOIN users on users.id == profiles.userId 
            WHERE users.username = ${req.url.substring(5)}
            AND profiles.active = 1
            ORDER BY profiles.locale
        `)
        return render(res, buildDict(function* () {
            for (let profile of profiles) {
                yield [profile.locale, buildProfile(profile)];
            }
        }));
    }

    if (!user || !user.authenticated) {
        return render(res, {error: 'unauthorised'}, 401);
    }

    return render(res, { error: 'notfound' }, 404);
}
