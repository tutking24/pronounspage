import { Router } from 'express';
import SQL from 'sql-template-strings';
import md5 from "js-md5";
import {ulid} from "ulid";
import avatar from "../avatar";

const normalise = s => s.trim().toLowerCase();

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
        WHERE lower(trim(replace(replace(replace(replace(replace(replace(replace(replace(replace(username, 'Ą', 'ą'), 'Ć', 'ć'), 'Ę', 'ę'), 'Ł', 'ł'), 'Ń', 'ń'), 'Ó', 'ó'), 'Ś', 'ś'), 'Ż', 'ż'), 'Ź', 'ż'))) = ${normalise(username)}
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
            customFlags: JSON.parse(profile.customFlags),
            words: JSON.parse(profile.words),
            avatar: await avatar(db, profile),
            birthday: self ? profile.birthday : undefined,
            teamName: profile.teamName,
            footerName: profile.footerName,
            footerAreas: profile.footerAreas ? profile.footerAreas.split(',') : [],
        };
    }
    return p;
};

const router = Router();

router.get('/profile/get/:username', async (req, res) => {
    return res.json(await fetchProfiles(req.db, req.params.username, req.user && req.user.username === req.params.username))
});

router.post('/profile/save', async (req, res) => {
    if (!req.user) {
        return res.status(401).json({error: 'Unauthorised'});
    }

    await req.db.get(SQL`DELETE FROM profiles WHERE userId = ${req.user.id} AND locale = ${req.config.locale}`);
    await req.db.get(SQL`INSERT INTO profiles (id, userId, locale, names, pronouns, description, birthday, links, flags, customFlags, words, active, teamName, footerName, footerAreas)
        VALUES (${ulid()}, ${req.user.id}, ${req.config.locale}, ${JSON.stringify(req.body.names)}, ${JSON.stringify(req.body.pronouns)},
                ${req.body.description}, ${req.body.birthday || null}, ${JSON.stringify(req.body.links.filter(x => !!x))}, ${JSON.stringify(req.body.flags)}, ${JSON.stringify(req.body.customFlags)},
                ${JSON.stringify(req.body.words)}, 1,
                ${req.isGranted('users') ? req.body.teamName || null : ''},
                ${req.isGranted('users') ? req.body.footerName || null : ''},
                ${req.isGranted('users') ? req.body.footerAreas.join(',').toLowerCase() || null : ''}
    )`);

    return res.json(await fetchProfiles(req.db, req.user.username, true));
});

router.post('/profile/delete', async (req, res) => {
    await req.db.get(SQL`DELETE FROM profiles WHERE userId = ${req.user.id} AND locale = ${req.config.locale}`);

    return res.json(await fetchProfiles(req.db, req.user.username, true));
});

export default router;
