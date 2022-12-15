import { Router } from 'express';
import SQL from 'sql-template-strings';
import {ulid} from "ulid";
import {findAdmins, handleErrorAsync} from "../../src/helpers";
import mailer from "../../src/mailer";
import {deduplicateEmailPreset} from "./user";

const router = Router();

const TRANSLATION_STATUS = {
    REJECTED: -1,
    AWAITING: 0,
    APPROVED: 1,
    MERGED: 2,
}

router.post('/translations/propose', handleErrorAsync(async (req, res) => {
    if (!req.user) {
        return res.status(401).json({error: 'Unauthorised'});
    }

    for (let tKey in req.body.changes) {
        if (!req.body.changes.hasOwnProperty(tKey)) { continue; }
        // TODO single insert
        await req.db.get(SQL`INSERT INTO translations (id, locale, tKey, tValue, status, author_id) VALUES (
            ${ulid()}, ${global.config.locale},
            ${tKey}, ${JSON.stringify(req.body.changes[tKey])},
            ${req.isGranted('translations') ? TRANSLATION_STATUS.APPROVED : TRANSLATION_STATUS.AWAITING}, ${req.user.id}
        )`)
    }

    if (req.isGranted('translations')) {
        for (let {email} of await findAdmins(req.db, global.config.locale, 'code')) {
            await deduplicateEmailPreset(req.db, email, 'translationToMerge', {locale: global.config.locale}, 60 * 60);
        }
    } else {
        for (let {email} of await findAdmins(req.db, global.config.locale, 'translations')) {
            await deduplicateEmailPreset(req.db, email, 'translationProposed', {locale: global.config.locale}, 60 * 60);
        }
    }

    return res.json('OK');
}));

router.get('/translations/proposals', handleErrorAsync(async (req, res) => {
    if (!req.isGranted('translations')) {
        return res.status(401).json({error: 'Unauthorised'});
    }

    return res.json(
        (await req.db.all(SQL`
            SELECT t.id, t.tKey, t.tValue, u.username AS author, t.status
            FROM translations t
                LEFT JOIN users u ON t.author_id = u.id
            WHERE locale = ${global.config.locale} AND (status = ${TRANSLATION_STATUS.AWAITING} OR status = ${TRANSLATION_STATUS.APPROVED})
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

    await req.db.get(SQL`UPDATE translations SET status = ${TRANSLATION_STATUS.REJECTED} WHERE id = ${req.body.id}`)

    return res.json('OK');
}));

router.post('/translations/accept-proposal', handleErrorAsync(async (req, res) => {
    if (!req.isGranted('translations')) {
        return res.status(401).json({error: 'Unauthorised'});
    }

    await req.db.get(SQL`UPDATE translations SET status = ${TRANSLATION_STATUS.APPROVED} WHERE id = ${req.body.id}`)

    for (let {email} of await findAdmins(req.db, global.config.locale, 'code')) {
        await deduplicateEmailPreset(req.db, email, 'translationToMerge', {locale: global.config.locale}, 60 * 60);
    }

    return res.json('OK');
}));


router.post('/translations/proposals-done', handleErrorAsync(async (req, res) => {
    if (!req.isGranted('translations')) {
        return res.status(401).json({error: 'Unauthorised'});
    }

    await req.db.get(SQL`UPDATE translations SET status = ${TRANSLATION_STATUS.MERGED}
        WHERE locale = ${global.config.locale} AND status = ${TRANSLATION_STATUS.APPROVED}`)

    return res.json('OK');
}));

export default router;
