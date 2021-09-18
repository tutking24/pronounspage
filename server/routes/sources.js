import { Router } from 'express';
import SQL from "sql-template-strings";
import {ulid} from "ulid";
import {clearKey, handleErrorAsync} from "../../src/helpers";

const approve = async (db, id) => {
    const { base_id } = await db.get(SQL`SELECT base_id FROM sources WHERE id=${id}`);
    if (base_id) {
        await db.get(SQL`
            UPDATE sources
            SET deleted=1
            WHERE id = ${base_id}
        `);
    }
    await db.get(SQL`
        UPDATE sources
        SET approved = 1, base_id = NULL
        WHERE id = ${id}
    `);
}

const keyGetMain = (key) => {
    return key.split('/')[0];
}

const linkOtherVersions = async (req, sources) => {
    const keys = new Set(sources.filter(s => !!s && s.key).map(s => keyGetMain(clearKey(s.key))));

    let sql = SQL`
        SELECT s.*, u.id AS submitter FROM sources s
        LEFT JOIN users u ON s.submitter_id = u.id
        WHERE s.locale != ${global.config.locale}
        AND s.deleted = 0
        AND s.approved >= ${req.isGranted('sources') ? 0 : 1}
        AND (`;
    for (let key of keys) {
        sql = sql.append(SQL`s.key = ${key} OR s.key LIKE ${key + '/%'} OR `)
    }
    sql = sql.append(SQL`0=1)`);

    const otherVersions = await req.db.all(sql);

    const otherVersionsMap = {};
    otherVersions.forEach(version => {
        const k = keyGetMain(version.key);
        if (otherVersionsMap[k] === undefined) {
            otherVersionsMap[k] = [];
        }
        otherVersionsMap[k].push(version);
    });

    return sources.map(s => {
        s.versions = s.key ? otherVersionsMap[keyGetMain(s.key)] || [] : [];
        return s;
    });
};

const router = Router();

router.get('/sources', handleErrorAsync(async (req, res) => {
    let sql = SQL`
        SELECT s.*, u.id AS submitter FROM sources s
        LEFT JOIN users u ON s.submitter_id = u.id
        WHERE s.locale = ${global.config.locale}
        AND s.deleted = 0
        AND s.approved >= ${req.isGranted('sources') ? 0 : 1}
    `;
    if (req.query.pronoun) {
        sql.append(SQL`AND s.pronouns LIKE ${'%' + req.query.pronoun + '%'}`)
    }
    return res.json(await linkOtherVersions(req, await req.db.all(sql)));
}));

router.get('/sources/:id', handleErrorAsync(async (req, res) => {
    return res.json(await linkOtherVersions(req, await req.db.all(SQL`
        SELECT s.*, u.id AS submitter FROM sources s
        LEFT JOIN users u ON s.submitter_id = u.id
        WHERE s.locale = ${global.config.locale}
        AND s.deleted = 0
        AND s.approved >= ${req.isGranted('sources') ? 0 : 1}
        AND s.id = ${req.params.id}
    `)));
}));

router.post('/sources/submit', handleErrorAsync(async (req, res) => {
    if (!req.user) {
        res.status(401).json({error: 'Unauthorised'});
    }

    const id = ulid();
    await req.db.get(SQL`
        INSERT INTO sources (id, locale, pronouns, type, author, title, extra, year, fragments, comment, link, key, images, submitter_id, base_id)
        VALUES (
            ${id}, ${global.config.locale}, ${req.body.pronouns.join(';')},
            ${req.body.type}, ${req.body.author}, ${req.body.title}, ${req.body.extra}, ${req.body.year},
            ${req.body.fragments.join('@').replace(/\n/g, '|')}, ${req.body.comment}, ${req.body.link},
            ${clearKey(req.body.key)}, ${req.body.images || null},
            ${req.user ? req.user.id : null}, ${req.body.base}
        )
    `);

    if (req.isGranted('sources')) {
        await approve(req.db, id);
    }

    return res.json('ok');
}));

router.post('/sources/hide/:id', handleErrorAsync(async (req, res) => {
    if (!req.isGranted('sources')) {
        res.status(401).json({error: 'Unauthorised'});
    }

    await req.db.get(SQL`
        UPDATE sources
        SET approved = 0
        WHERE id = ${req.params.id}
    `);

    return res.json('ok');
}));

router.post('/sources/approve/:id', handleErrorAsync(async (req, res) => {
    if (!req.isGranted('sources')) {
        res.status(401).json({error: 'Unauthorised'});
    }

    await approve(req.db, req.params.id);

    return res.json('ok');
}));

router.post('/sources/remove/:id', handleErrorAsync(async (req, res) => {
    if (!req.isGranted('sources')) {
        res.status(401).json({error: 'Unauthorised'});
    }

    await req.db.get(SQL`
        UPDATE sources
        SET deleted=1
        WHERE id = ${req.params.id}
    `);

    return res.json('ok');
}));

export default router;
