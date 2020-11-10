import { Router } from 'express';
import SQL from 'sql-template-strings';
import {ulid} from "ulid";

const isTroll = (body) => {
    return ['cipeusz', 'feminazi', 'bruksela', 'zboczeń'].some(t => body.indexOf(t) > -1);
}

const approve = async (db, id) => {
    const { base_id } = await db.get(SQL`SELECT base_id FROM nouns WHERE id=${id}`);
    if (base_id) {
        await db.get(SQL`
            DELETE FROM nouns
            WHERE id = ${base_id}
        `);
    }
    await db.get(SQL`
        UPDATE nouns
        SET approved = 1, base_id = NULL
        WHERE id = ${id}
    `);
}

const router = Router();

router.get('/nouns', async (req, res) => {
    return res.json(await req.db.all(SQL`
        SELECT * FROM nouns
        WHERE locale = ${req.config.locale}
        AND approved >= ${req.admin ? 0 : 1}
        ORDER BY approved, masc
    `));
});

router.get('/nouns/search/:term', async (req, res) => {
    const term = '%' + req.params.term + '%';
    return res.json(await req.db.all(SQL`
        SELECT * FROM nouns
        WHERE locale = ${req.config.locale}
        AND approved >= ${req.admin ? 0 : 1}
        AND (masc like ${term} OR fem like ${term} OR neutr like ${term} OR mascPl like ${term} OR femPl like ${term} OR neutrPl like ${term})
        ORDER BY approved, masc
    `));
});

router.post('/nouns/submit', async (req, res) => {
    if (!(req.user && req.user.admin) && isTroll(JSON.stringify(req.body))) {
        return res.json('ok');
    }

    const id = ulid();
    await req.db.get(SQL`
        INSERT INTO nouns (id, masc, fem, neutr, mascPl, femPl, neutrPl, approved, base_id, locale)
        VALUES (
            ${id},
            ${req.body.masc.join('|')}, ${req.body.fem.join('|')}, ${req.body.neutr.join('|')},
            ${req.body.mascPl.join('|')}, ${req.body.femPl.join('|')}, ${req.body.neutrPl.join('|')},
            0, ${req.body.base}, ${req.config.locale}
        )
    `);

    if (req.admin) {
        await approve(req.db, id);
    }

    return res.json('ok');
});

router.post('/nouns/hide/:id', async (req, res) => {
    if (!req.admin) {
        res.status(401).json({error: 'Unauthorised'});
    }

    await req.db.get(SQL`
        UPDATE nouns
        SET approved = 0
        WHERE id = ${req.params.id}
    `);

    return res.json('ok');
});

router.post('/nouns/approve/:id', async (req, res) => {
    if (!req.admin) {
        res.status(401).json({error: 'Unauthorised'});
    }

    await approve(req.db, req.params.id);

    return res.json('ok');
});

router.post('/nouns/remove/:id', async (req, res) => {
    if (!req.admin) {
        res.status(401).json({error: 'Unauthorised'});
    }

    await req.db.get(SQL`
        DELETE FROM nouns
        WHERE id = ${req.params.id}
    `);

    return res.json('ok');
});

export default router;
