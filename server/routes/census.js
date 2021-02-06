import { Router } from 'express';
import SQL from 'sql-template-strings';
import sha1 from 'sha1';
import {ulid} from "ulid";
import Papa from 'papaparse';

const getIp = req => {
    try {
        return req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ips.join(',') || req.ip;
    } catch {
        return '';
    }
}

const buildFingerprint = req => sha1(`
    ${getIp(req)}
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
        return !!byUser;
    }

    const fingerprint = buildFingerprint(req);
    const byFingerprint = await req.db.get(SQL`
        SELECT * FROM census
        WHERE locale = ${req.config.locale}
        AND edition = ${req.config.census.edition}
        AND fingerprint = ${fingerprint}
        AND userId IS NULL
    `);
    return !!byFingerprint;
}

const router = Router();

router.get('/census/finished', async (req, res) => {
    return res.json(await hasFinished(req));
});

router.post('/census/submit', async (req, res) => {
    const suspicious = await hasFinished(req);

    const id = ulid();
    await req.db.get(SQL`INSERT INTO census (id, locale, edition, userId, fingerprint, answers, writins, ip, userAgent, acceptLanguage, suspicious) VALUES (
        ${id},
        ${req.config.locale},
        ${req.config.census.edition},
        ${req.user ? req.user.id : null},
        ${buildFingerprint(req)},
        ${req.body.answers},
        ${req.body.writins},
        null,
        null,
        null,
        ${suspicious}
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

router.get('/census/export', async (req, res) => {
    if (!req.isGranted('census')) {
        res.status(401).json({error: 'Unauthorised'});
    }

    const report = [];
    for (let {answers, writins} of await req.db.all(SQL`
        SELECT answers, writins FROM census
        WHERE locale = ${req.config.locale}
        AND edition = ${req.config.census.edition}
        AND suspicious = 0
    `)) {
        answers = JSON.parse(answers);
        writins = JSON.parse(writins);

        const answer = {};
        let i = 0;
        for (let question of config.census.questions) {
            if (question.type === 'checkbox') {
                for (let [option, comment] of question.options) {
                    answer[`${i}_${option}`] = (answers[i.toString()] || []).includes(option) ? 1 : '';
                }
            } else {
                answer[`${i}_`] = answers[i.toString()] || '';
            }
            if (question.writein) {
                answer[`${i}__writein`] = writins[i.toString()] || '';
            }
            i++;
        }

        report.push(answer);
    }

    return res.set('content-type', 'text/csv').send(Papa.unparse(report));
});

export default router;
