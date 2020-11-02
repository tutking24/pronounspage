import { Router } from 'express';
import SQL from 'sql-template-strings';
import md5 from "js-md5";
import {buildDict} from "../../src/helpers";
import {ulid} from "ulid";
import avatar from "../avatar";

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

const fetchProfiles = async (db, username, self) => {
    const profiles = await db.all(SQL`
        SELECT profiles.*, users.id, users.username, users.email, users.avatarSource FROM profiles LEFT JOIN users on users.id == profiles.userId 
        WHERE users.username = ${username}
        AND profiles.active = 1
        ORDER BY profiles.locale
    `);

    const p = {}
    for (let profile of profiles) {
        p[profile.locale] = {
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
            avatar: await avatar(db, profile),
            birthday: self ? profile.birthday : undefined,
        };
    }
    return p;
};

const router = Router();

router.get('/profile/get/:username', async (req, res) => {
    return res.json(await fetchProfiles(req.db, req.params.username, req.user && req.user.username === req.params.username))
});

router.post('/profile/save/:locale', async (req, res) => {
    if (!req.user) {
        return res.status(401).json({error: 'Unauthorised'});
    }

    const userId = (await req.db.get(SQL`SELECT id FROM users WHERE username = ${req.user.username}`)).id;

    await req.db.get(SQL`DELETE FROM profiles WHERE userId = ${userId} AND locale = ${req.params.locale}`);
    await req.db.get(SQL`INSERT INTO profiles (id, userId, locale, names, pronouns, description, birthday, links, flags, words, active)
        VALUES (${ulid()}, ${userId}, ${req.params.locale}, ${JSON.stringify(req.body.names)}, ${JSON.stringify(req.body.pronouns)},
                ${req.body.description}, ${req.body.birthday || null}, ${JSON.stringify(req.body.links)}, ${JSON.stringify(req.body.flags)},
                ${JSON.stringify(req.body.words)}, 1
    )`);

    return res.json(await fetchProfiles(req.db, req.user.username, true));
});

router.post('/profile/delete/:locale', async (req, res) => {
    const userId = (await req.db.get(SQL`SELECT id FROM users WHERE username = ${req.user.username}`)).id;

    await req.db.get(SQL`DELETE FROM profiles WHERE userId = ${userId} AND locale = ${req.params.locale}`);

    return res.json(await fetchProfiles(req.db, req.user.username, true));
});

export default router;
