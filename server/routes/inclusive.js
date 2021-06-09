import { Router } from 'express';
import SQL from 'sql-template-strings';
import {ulid} from "ulid";
import {isTroll, handleErrorAsync} from "../../src/helpers";

const approve = async (db, id) => {
    const { base_id } = await db.get(SQL`SELECT base_id FROM inclusive WHERE id=${id}`);
    if (base_id) {
        await db.get(SQL`
            UPDATE inclusive
            SET deleted=1
            WHERE id = ${base_id}
        `);
    }
    await db.get(SQL`
        UPDATE inclusive
        SET approved = 1, base_id = NULL
        WHERE id = ${id}
    `);
}

const router = Router();

router.get('/inclusive', handleErrorAsync(async (req, res) => {
    return res.json(await req.db.all(SQL`
        SELECT i.*, u.username AS author FROM inclusive i
        LEFT JOIN users u ON i.author_id = u.id
        WHERE i.locale = ${req.config.locale}
        AND i.approved >= ${req.isGranted('inclusive') ? 0 : 1}
        AND i.deleted = 0
        ORDER BY i.approved, i.insteadOf
    `));
}));

router.get('/inclusive/search/:term', handleErrorAsync(async (req, res) => {
    const term = '%' + req.params.term + '%';
    return res.json(await req.db.all(SQL`
        SELECT i.*, u.username AS author FROM inclusive i
        LEFT JOIN users u ON i.author_id = u.id
        WHERE i.locale = ${req.config.locale}
        AND i.approved >= ${req.isGranted('inclusive') ? 0 : 1}
        AND i.deleted = 0
        AND (i.insteadOf like ${term} OR i.say like ${term})
        ORDER BY i.approved, i.insteadOf
    `));
}));

router.post('/inclusive/submit', handleErrorAsync(async (req, res) => {
    if (!(req.user && req.user.admin) && isTroll(JSON.stringify(req.body))) {
        return res.json('ok');
    }

    const id = ulid();
    await req.db.get(SQL`
        INSERT INTO inclusive (id, insteadOf, say, because, approved, base_id, locale, author_id, categories, links)
        VALUES (
            ${id},
            ${req.body.insteadOf.join('|')}, ${req.body.say.join('|')}, ${req.body.because},
            0, ${req.body.base}, ${req.config.locale}, ${req.user ? req.user.id : null},
            ${req.body.categories.join(',')}, ${JSON.stringify(req.body.links)}
        )
    `);

    if (req.isGranted('inclusive')) {
        await approve(req.db, id);
    }

    return res.json('ok');
}));

router.post('/inclusive/hide/:id', handleErrorAsync(async (req, res) => {
    if (!req.isGranted('inclusive')) {
        res.status(401).json({error: 'Unauthorised'});
    }

    await req.db.get(SQL`
        UPDATE inclusive
        SET approved = 0
        WHERE id = ${req.params.id}
    `);

    return res.json('ok');
}));

router.post('/inclusive/approve/:id', handleErrorAsync(async (req, res) => {
    if (!req.isGranted('inclusive')) {
        res.status(401).json({error: 'Unauthorised'});
    }

    await approve(req.db, req.params.id);

    return res.json('ok');
}));

router.post('/inclusive/remove/:id', handleErrorAsync(async (req, res) => {
    if (!req.isGranted('inclusive')) {
        res.status(401).json({error: 'Unauthorised'});
    }

    await req.db.get(SQL`
        UPDATE inclusive
        SET deleted=1
        WHERE id = ${req.params.id}
    `);

    return res.json('ok');
}));

export default router;
