import { Router } from 'express';
import SQL from 'sql-template-strings';
import {ulid} from "ulid";
import {handleErrorAsync} from "../../src/helpers";
import {validateEmail} from "./user";

const router = Router();

router.post('/subscription/subscribe', handleErrorAsync(async (req, res) => {
    const email = (req.body.email || '').toLowerCase();
    if (!email || !await validateEmail(email) || !['census'].includes(req.body.type)) {
        console.log(email, await validateEmail(email), ['census'].includes(req.body.type));
        return res.status(400).json({error: 'Bad request'});
    }

    const existing = await req.db.get(SQL`SELECT COUNT(*) as c FROM subscriptions WHERE email = ${email}`);

    if (existing.c === 0) {
        await req.db.get(SQL`INSERT INTO subscriptions (id, locale, type, email) VALUES
            (${ulid()}, ${global.config.locale}, ${req.body.type}, ${email})`)
    }

    return res.json('Subscribed');
}));

// TODO /api/subscription/unsubscribe?email=andrea@avris.it&type=census
router.get('/subscription/unsubscribe', handleErrorAsync(async (req, res) => {
    if (!req.query.email) {
        return res.status(400).json({error: 'Bad request'});
    }

    await req.db.get(SQL`DELETE FROM subscriptions WHERE email = ${req.query.email} AND type = ${req.query.type}`)

    return res.json('Unsubscribed');
}));

export default router;
