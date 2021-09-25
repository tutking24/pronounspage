import { Router } from 'express';
import SQL from 'sql-template-strings';
import {ulid} from "ulid";
import {handleErrorAsync, isTroll} from "../../src/helpers";
import { caches } from "../../src/cache";

const approve = async (db, id) => {
    const { base_id } = await db.get(SQL`SELECT base_id FROM names WHERE id=${id}`);
    if (base_id) {
        await db.get(SQL`
            UPDATE names
            SET deleted=1
            WHERE id = ${base_id}
        `);
    }
    await db.get(SQL`
        UPDATE names
        SET approved = 1, base_id = NULL
        WHERE id = ${id}
    `);
    await caches.names.invalidate();
}

const router = Router();

router.get('/names', handleErrorAsync(async (req, res) => {
    return res.json(await caches.names.fetch(async () => {
        return await req.db.all(SQL`
            SELECT n.*, u.username AS author FROM names n
            LEFT JOIN users u ON n.author_id = u.id
            WHERE n.locale = ${global.config.locale}
            AND n.deleted = 0
            AND n.approved >= ${req.isGranted('names') ? 0 : 1}
            ORDER BY n.approved, n.name
        `)
    }, !req.isGranted('names')));
}));

router.post('/names/submit', handleErrorAsync(async (req, res) => {
    if (!req.user) {
        res.status(401).json({error: 'Unauthorised'});
    }

    if (!(req.user && req.user.admin) && isTroll(JSON.stringify(req.body))) {
        return res.json('ok');
    }

    const id = ulid();
    await req.db.get(SQL`
        INSERT INTO names (id, name, locale, origin, meaning, usage, legally, pros, cons, notablePeople, links, namedays, namedaysComment, deleted, approved, base_id, author_id)
        VALUES (
            ${id},
            ${req.body.name}, ${global.config.locale},
            ${req.body.origin || null}, ${req.body.meaning || null}, ${req.body.usage || null}, ${req.body.legally || null},
            ${req.body.pros.length ? req.body.pros.join('|') : null}, ${req.body.cons.length ? req.body.cons.join('|') : null},
            ${req.body.notablePeople.length ? req.body.notablePeople.join('|') : null}, ${req.body.links.length ? req.body.links.join('|') : null},
            ${req.body.namedays.length ? req.body.namedays.join('|') : null}, ${req.body.namedaysComment || null},
            0, 0, ${req.body.base}, ${req.user ? req.user.id : null}
        )
    `);

    if (req.isGranted('names')) {
        await approve(req.db, id);
    }

    return res.json('ok');
}));

router.post('/names/hide/:id', handleErrorAsync(async (req, res) => {
    if (!req.isGranted('names')) {
        res.status(401).json({error: 'Unauthorised'});
    }

    await req.db.get(SQL`
        UPDATE names
        SET approved = 0
        WHERE id = ${req.params.id}
    `);

    await caches.names.invalidate();

    return res.json('ok');
}));

router.post('/names/approve/:id', handleErrorAsync(async (req, res) => {
    if (!req.isGranted('names')) {
        res.status(401).json({error: 'Unauthorised'});
    }

    await approve(req.db, req.params.id);

    return res.json('ok');
}));

router.post('/names/remove/:id', handleErrorAsync(async (req, res) => {
    if (!req.isGranted('names')) {
        res.status(401).json({error: 'Unauthorised'});
    }

    await req.db.get(SQL`
        UPDATE names
        SET deleted=1
        WHERE id = ${req.params.id}
    `);

    await caches.names.invalidate();

    return res.json('ok');
}));

export default router;
