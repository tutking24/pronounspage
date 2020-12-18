import { Router } from 'express';
import SQL from 'sql-template-strings';
import sha1 from 'sha1';
import {ulid} from "ulid";

const buildFingerprint = req => sha1(`
    ${req.ip}
    ${req.headers['user-agent']}
    ${req.headers['accept-language']}
`);

const hasFinished = async req => {
    if (req.user) {
        const byUser = await req.db.get(SQL`
            SELECT * FROM census
            WHERE locale = ${req.config.locale}
            AND edition = ${req.config.census.edition}
            AND userId = ${req.user.id}
        `);
        if (byUser) {
            return true;
        }
    }

    const fingerprint = buildFingerprint(req);
    const byFingerprint = await req.db.get(SQL`
        SELECT * FROM census
        WHERE locale = ${req.config.locale}
        AND edition = ${req.config.census.edition}
        AND fingerprint = ${fingerprint}
    `);
    if (byFingerprint) {
        return true;
    }

    return false;
}

const router = Router();

router.get('/census/finished', async (req, res) => {
    return res.json(await hasFinished(req));
});

router.post('/census/submit', async (req, res) => {
    if (await hasFinished(req)) {
        return res.status(401).json({error: 'Unauthorised'});
    }

    const id = ulid();
    await req.db.get(SQL`INSERT INTO census (id, locale, edition, userId, fingerprint, answers, writins) VALUES (
        ${id},
        ${req.config.locale},
        ${req.config.census.edition},
        ${req.user ? req.user.id : null},
        ${buildFingerprint(req)},
        ${req.body.answers},
        ${req.body.writins}
    )`);

    return res.json(id);
});

router.get('/census/count', async (req, res) => {
    return res.json((await req.db.get(SQL`
        SELECT COUNT(*) as c FROM census
        WHERE locale = ${req.config.locale}
        AND edition = ${req.config.census.edition}
    `)).c);
});

export default router;
