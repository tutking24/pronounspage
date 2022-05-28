import { Router } from 'express';
import SQL from 'sql-template-strings';
import sha1 from 'sha1';
import {ulid} from "ulid";
import Papa from 'papaparse';
import {handleErrorAsync} from "../../src/helpers";
import {intersection, difference} from "../../src/sets";

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
            WHERE locale = ${global.config.locale}
            AND edition = ${global.config.census.edition}
            AND userId = ${req.user.id}
        `);
        return !!byUser;
    }

    const fingerprint = buildFingerprint(req);
    const byFingerprint = await req.db.get(SQL`
        SELECT * FROM census
        WHERE locale = ${global.config.locale}
        AND edition = ${global.config.census.edition}
        AND fingerprint = ${fingerprint}
        AND userId IS NULL
    `);
    return !!byFingerprint;
}

const isRelevant = (answers) => {
    return global.config.census.relevant.includes(answers['0']);
}

const isTroll = (answers, writins) => {
    if (Object.values(writins).filter(x => !!x).length) {
        return null; // unknown, send to moderation
    }

    for (let i in global.config.census.questions) {
        if (global.config.census.questions[i].type === 'textarea' && answers[i.toString()]) {
            return null; // unknown, send to moderation
        }
    }

    return false; // no free-text provided
}

const router = Router();

router.get('/census/finished', handleErrorAsync(async (req, res) => {
    return res.json(await hasFinished(req));
}));

router.post('/census/submit', handleErrorAsync(async (req, res) => {
    const answers = JSON.parse(req.body.answers);
    const writins = JSON.parse(req.body.writins);

    const id = ulid();
    await req.db.get(SQL`INSERT INTO census (id, locale, edition, userId, fingerprint, answers, writins, suspicious, relevant, troll) VALUES (
        ${id},
        ${global.config.locale},
        ${global.config.census.edition},
        ${req.user ? req.user.id : null},
        ${buildFingerprint(req)},
        ${req.body.answers},
        ${req.body.writins},
        ${await hasFinished(req)},
        ${isRelevant(answers) ? 1 : 0},
        ${isTroll(answers, writins) ? 1 : 0}
    )`);

    return res.json(id);
}));

router.get('/census/count', handleErrorAsync(async (req, res) => {
    if (!req.isGranted('census')) {
        return res.json({
            all: 0,
            nonbinary: 0,
            usable: 0,
            awaiting: 0,
        });
    }

    // duplication reason: https://github.com/felixfbecker/node-sql-template-strings/issues/71

    return res.json({
        all: (await req.db.get(SQL`
            SELECT COUNT(*) as c FROM census
            WHERE locale = ${global.config.locale}
              AND edition = ${global.config.census.edition}
        `)).c,
        nonbinary: (await req.db.get(SQL`
            SELECT COUNT(*) as c FROM census
            WHERE locale = ${global.config.locale}
              AND edition = ${global.config.census.edition}
              AND relevant = 1
        `)).c,
        usable: (await req.db.get(SQL`
            SELECT COUNT(*) as c FROM census
            WHERE locale = ${global.config.locale}
              AND edition = ${global.config.census.edition}
              AND relevant = 1
              AND troll = 0
        `)).c,
        awaiting: (await req.db.get(SQL`
            SELECT COUNT(*) as c FROM census
            WHERE locale = ${global.config.locale}
              AND edition = ${global.config.census.edition}
              AND troll IS NULL
        `)).c,
    });
}));

const calculateAggregate = (config, answer) => {
    const expected = new Set(config.values);
    if (config.exclusive && difference(answer, expected).size > 0) {
        return false;
    }
    switch (config.operation) {
        case 'OR':
            return intersection(expected, answer).size > 0;
        case 'AND':
            return intersection(expected, answer).size === expected.size;
        default:
            throw new Exception(`Operation "${config.operation} not supported"`);
    }
}

router.get('/census/export', handleErrorAsync(async (req, res) => {
    if (!req.isGranted('census')) {
        return res.status(401).json({error: 'Unauthorised'});
    }

    const report = [];
    for (let {answers, writins, troll} of await req.db.all(SQL`
        SELECT answers, writins FROM census
        WHERE locale = ${global.config.locale}
          AND edition = ${global.config.census.edition}
          AND suspicious = 0
          AND troll = 0
          AND relevant = 1
    `)) {
        answers = JSON.parse(answers);
        writins = JSON.parse(writins);

        const answer = {};
        let i = 0;
        for (let question of config.census.questions) {
            if (question.type === 'checkbox') {
                const answerForAggregate = new Set();
                for (let [option, comment] of question.options) {
                    const checked = (answers[i.toString()] || []).includes(option);
                    answer[`${i}_${option}`] = checked ? 1 : '';
                    if (checked) {
                        answerForAggregate.add(option);
                    }
                }
                for (let aggr in question.aggregates || {}) {
                    if (!question.aggregates.hasOwnProperty(aggr)) { continue; }
                    answer[`${i}_aggr_${aggr}`] = calculateAggregate(question.aggregates[aggr], answerForAggregate) ? 1 : '';
                }
            } else {
                answer[`${i}_`] = (answers[i.toString()] || '').replace(/\n/g, ' | ');
            }
            if (question.writein) {
                answer[`${i}__writein`] = (writins[i.toString()] || '').replace(/\n/g, ' | ');
            }
            i++;
        }

        report.push(answer);
    }

    return res.set('content-type', 'text/csv').send(Papa.unparse(report));
}));

router.get('/census/moderation/queue', handleErrorAsync(async (req, res) => {
    if (!req.isGranted('census')) {
        return res.status(401).json({error: 'Unauthorised'});
    }

    const queue = await req.db.all(SQL`
        SELECT id, answers, writins FROM census
        WHERE locale = ${global.config.locale}
          AND edition = ${global.config.census.edition}
          AND troll IS NULL
        ORDER BY RANDOM()
    `);

    return res.json({
        count: queue.length,
        next: queue.length ? queue[0] : null,
    });
}));

router.post('/census/moderation/decide', handleErrorAsync(async (req, res) => {
    if (!req.isGranted('census')) {
        return res.status(401).json({error: 'Unauthorised'});
    }

    const queue = await req.db.get(SQL`
        UPDATE census SET troll = ${parseInt(req.body.decision)} WHERE id = ${req.body.id} 
    `);

    return res.json('ok');
}));

export default router;
