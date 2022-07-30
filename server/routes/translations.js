import { Router } from 'express';
import SQL from 'sql-template-strings';
import {ulid} from "ulid";
import { handleErrorAsync } from "../../src/helpers";
import mailer from "../../src/mailer";

const router = Router();

router.post('/translations/propose', handleErrorAsync(async (req, res) => {
    if (!req.isGranted('translations')) {
        return res.status(401).json({error: 'Unauthorised'});
    }

    for (let tKey in req.body.changes) {
        if (!req.body.changes.hasOwnProperty(tKey)) { continue; }
        // TODO single insert
        await req.db.get(SQL`INSERT INTO translations (id, locale, tKey, tValue, status, author_id) VALUES (
            ${ulid()}, ${global.config.locale},
            ${tKey}, ${JSON.stringify(req.body.changes[tKey])},
            0, ${req.user ? req.user.id : null}
        )`)
    }

    for (let email of ['contact@pronouns.page']) {
        mailer(email, 'translationProposed', {locale: global.config.locale});
    }

    return res.json('OK');
}));

router.get('/translations/proposals', handleErrorAsync(async (req, res) => {
    if (!req.isGranted('translations')) {
        return res.status(401).json({error: 'Unauthorised'});
    }

    return res.json(
        (await req.db.all(SQL`
            SELECT t.id, t.tKey, t.tValue, u.username AS author
            FROM translations t
                LEFT JOIN users u ON t.author_id = u.id
            WHERE locale = ${global.config.locale} AND status = 0
        `)).map(tp => {
            return {
                ...tp,
                tValue: JSON.parse(tp.tValue),
            }
        })
    );
}));

router.post('/translations/reject-proposal', handleErrorAsync(async (req, res) => {
    if (!req.isGranted('translations')) {
        return res.status(401).json({error: 'Unauthorised'});
    }

    await req.db.get(SQL`UPDATE translations SET status = -1 WHERE id = ${req.body.id}`)

    return res.json('OK');
}));

router.post('/translations/proposals-done', handleErrorAsync(async (req, res) => {
    if (!req.isGranted('translations')) {
        return res.status(401).json({error: 'Unauthorised'});
    }

    await req.db.get(SQL`UPDATE translations SET status = 1 WHERE locale = ${global.config.locale} AND status = 0`)

    return res.json('OK');
}));

export default router;
