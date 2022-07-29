import { Router } from 'express';
import SQL from 'sql-template-strings';
import {ulid} from "ulid";
import { handleErrorAsync } from "../../src/helpers";

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

    // TODO email

    return res.json('OK');
}));

export default router;
