import { Router } from 'express';
import SQL from "sql-template-strings";
import {ulid} from "ulid";

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

const router = Router();

router.get('/sources', async (req, res) => {
    return res.json(await req.db.all(SQL`
        SELECT s.*, u.username AS submitter FROM sources s
        LEFT JOIN users u ON s.submitter_id = u.id
        WHERE s.locale = ${req.config.locale}
        AND s.deleted = 0
        AND s.approved >= ${req.admin ? 0 : 1}
    `));
});

router.get('/sources/:id', async (req, res) => {
    return res.json(await req.db.all(SQL`
        SELECT s.*, u.username AS submitter FROM sources s
        LEFT JOIN users u ON s.submitter_id = u.id
        WHERE s.locale = ${req.config.locale}
        AND s.deleted = 0
        AND s.approved >= ${req.admin ? 0 : 1}
        AND s.id = ${req.params.id}
    `));
});

router.post('/sources/submit', async (req, res) => {
    console.log(req.body.fragments);
    console.log(req.body.fragments.join('@'));
    console.log(req.body.fragments.join('@').replace(/\n/g, '|'));

    const id = ulid();
    await req.db.get(SQL`
        INSERT INTO sources (id, locale, pronouns, type, author, title, extra, year, fragments, comment, link, submitter_id, base_id)
        VALUES (
            ${id}, ${req.config.locale}, ${req.body.pronouns.join(';')},
            ${req.body.type}, ${req.body.author}, ${req.body.title}, ${req.body.extra}, ${req.body.year},
            ${req.body.fragments.join('@').replace(/\n/g, '|')}, ${req.body.comment}, ${req.body.link},
            ${req.user ? req.user.id : null}, ${req.body.base}  
        )
    `);

    if (req.admin) {
        await approve(req.db, id);
    }

    return res.json('ok');
});

router.post('/sources/hide/:id', async (req, res) => {
    if (!req.admin) {
        res.status(401).json({error: 'Unauthorised'});
    }

    await req.db.get(SQL`
        UPDATE sources
        SET approved = 0
        WHERE id = ${req.params.id}
    `);

    return res.json('ok');
});

router.post('/sources/approve/:id', async (req, res) => {
    if (!req.admin) {
        res.status(401).json({error: 'Unauthorised'});
    }

    await approve(req.db, req.params.id);

    return res.json('ok');
});

router.post('/sources/remove/:id', async (req, res) => {
    if (!req.admin) {
        res.status(401).json({error: 'Unauthorised'});
    }

    await req.db.get(SQL`
        UPDATE sources
        SET deleted=1
        WHERE id = ${req.params.id}
    `);

    return res.json('ok');
});

export default router;
