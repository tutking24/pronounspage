import { Router } from 'express';
import SQL from 'sql-template-strings';
import {ulid} from "ulid";
import {isTroll} from "../../src/helpers";

const approve = async (db, id) => {
    const { base_id } = await db.get(SQL`SELECT base_id FROM terms WHERE id=${id}`);
    if (base_id) {
        await db.get(SQL`
            UPDATE terms
            SET deleted=1
            WHERE id = ${base_id}
        `);
    }
    await db.get(SQL`
        UPDATE terms
        SET approved = 1, base_id = NULL
        WHERE id = ${id}
    `);
}

const router = Router();

router.get('/terms', async (req, res) => {
    return res.json(await req.db.all(SQL`
        SELECT i.*, u.username AS author FROM terms i
        LEFT JOIN users u ON i.author_id = u.id
        WHERE i.locale = ${req.config.locale}
        AND i.approved >= ${req.admin ? 0 : 1}
        AND i.deleted = 0
        ORDER BY i.term
    `));
});

router.get('/terms/search/:term', async (req, res) => {
    const term = '%' + req.params.term + '%';
    return res.json(await req.db.all(SQL`
        SELECT i.*, u.username AS author FROM terms i
        LEFT JOIN users u ON i.author_id = u.id
        WHERE i.locale = ${req.config.locale}
        AND i.approved >= ${req.admin ? 0 : 1}
        AND i.deleted = 0
        AND (i.term like ${term} OR i.original like ${term})
        ORDER BY i.term
    `));
});

router.post('/terms/submit', async (req, res) => {
    if (!(req.user && req.user.admin) && isTroll(JSON.stringify(req.body))) {
        return res.json('ok');
    }

    const id = ulid();
    await req.db.get(SQL`
        INSERT INTO terms (id, term, original, definition, approved, base_id, locale, author_id, flags)
        VALUES (
            ${id},
            ${req.body.term.join('|')}, ${req.body.original.join('|')}, ${req.body.definition},
            0, ${req.body.base}, ${req.config.locale}, ${req.user ? req.user.id : null},
            ${JSON.stringify(req.body.flags)}
        )
    `);

    if (req.admin) {
        await approve(req.db, id);
    }

    return res.json('ok');
});

router.post('/terms/hide/:id', async (req, res) => {
    if (!req.admin) {
        res.status(401).json({error: 'Unauthorised'});
    }

    await req.db.get(SQL`
        UPDATE terms
        SET approved = 0
        WHERE id = ${req.params.id}
    `);

    return res.json('ok');
});

router.post('/terms/approve/:id', async (req, res) => {
    if (!req.admin) {
        res.status(401).json({error: 'Unauthorised'});
    }

    await approve(req.db, req.params.id);

    return res.json('ok');
});

router.post('/terms/remove/:id', async (req, res) => {
    if (!req.admin) {
        res.status(401).json({error: 'Unauthorised'});
    }

    await req.db.get(SQL`
        UPDATE terms
        SET deleted=1
        WHERE id = ${req.params.id}
    `);

    return res.json('ok');
});

export default router;
