const {decodeTime} = require('ulid');
const mailer = require('./mailer');
const Plausible = require('plausible-api');
const fetch = require('node-fetch');
const { ulid } = require('ulid');
const expectedTranslations = require('../locale/expectedTranslations')
const fs = require('fs');
const Suml = require('suml');

// TODO all the duplication...
const buildDict = (fn, ...args) => {
    const dict = {};
    for (let [key, value] of fn(...args)) {
        dict[key] = value;
    }
    return dict;
}

const zip = (list, reverse) => {
    return buildDict(function* () {
        for (let [k, v] of list) {
            yield reverse ? [v, k] : [k, v];
        }
    });
}

const sortByValue = (obj, reverse = false, firstN = -1) => {
    let list = [];
    for (let i in obj) {
        if (obj.hasOwnProperty(i)) {
            list.push([parseInt(obj[i]), i]);
        }
    }
    list = list.sort((a, b) => reverse ? b[0] - a[0] : a[0] - b[0]);
    if (firstN >= 0) {
        list = list.slice(0, firstN);
    }

    return zip(list, true);
}

const deepGet = (obj, path) => {
    let value = obj;
    for (let part of path.split('.')) {
        value = value[part];
        if (value === undefined) { break; }
    }

    return value;
}

const formatDate = d => `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;

module.exports.buildChart = (rows, cumulative = true) => {
    const dates = rows.map(row => new Date(decodeTime(row.id)));

    const chart = {};

    let loop = dates[0];
    const end = dates[dates.length - 1];
    while(loop <= end){
        chart[formatDate(loop)] = 0;
        loop = new Date(loop.setDate(loop.getDate() + 1));
    }
    if (!loop) {
        return {};
    }
    chart[formatDate(loop)] = 0;

    for (let date of dates) {
        chart[formatDate(date)]++;
    }

    if (!cumulative) {
        return chart;
    }

    const cumChart = {};
    let cum = 0;
    for (let [date, count] of Object.entries(chart)) {
        cum += count;
        cumChart[date] = cum;
    }

    return cumChart;
}

const plausibleClient = new Plausible(process.env.PLAUSIBLE_API_KEY, process.env.PLAUSIBLE_API_HOST + '/api/v1/stats');

const checkPlausible = async (url) => {
    let plausible = undefined;

    try {
        const domain = url.replace(new RegExp('^https?://'), '')
        plausible = await plausibleClient.aggregate(domain, '30d', ['visitors', 'pageviews', 'visit_duration'])
        plausible.realTimeVisitors = await plausibleClient.getRealtimeVisitors(domain);
    } catch {}

    return plausible;
}

const checkHeartbeat = async () => {
    let heartbeat = {};
    try {
         for (let [page, pageStats] of Object.entries((await (await fetch(`${process.env.HEARTBEAT_LINK}/30d.json`)).json()).pages)) {
             if (page.startsWith('dns-')) { continue; }
             heartbeat[`https://${page}`] = {
                 uptime: pageStats.uptime,
                 avgResponseTime: pageStats.avgResponseTime,
             };
         }
    } catch {}

    return heartbeat;
}

const deduplicateAdminMail = (projectDir, type, seconds) => {
    const filename = `${projectDir}/dedup-${type}`;
    if (!fs.existsSync(filename)) {
        fs.writeFileSync(filename, +new Date() + '')
        return true;
    }

    try {
        const lastSent = new Date(parseInt(fs.readFileSync(filename)));
        if (new Date() - lastSent < seconds * 1000) {
            return false;
        }
    } catch {}

    fs.writeFileSync(filename, +new Date() + '')
    return true;
}

module.exports.calculateStats = async (db, allLocales, projectDir) => {
    const id = ulid();

    const heartbeat = await checkHeartbeat();

    const cardsQueue = (await db.get(`SELECT count(*) as c FROM profiles WHERE card = '' OR cardDark = ''`)).c;
    if (cardsQueue > 64 && deduplicateAdminMail(projectDir, 'cards', 60 * 60)) {
        mailer('contact@pronouns.page', 'cardsWarning', {count: cardsQueue});
    }
    const linksQueue = (await db.get(`SELECT count(*) as c FROM links WHERE (expiresAt IS NULL OR expiresAt <= ${new Date() / 1000})`)).c;
    if (linksQueue > 256 && deduplicateAdminMail(projectDir, 'links', 60 * 60)) {
        mailer('contact@pronouns.page', 'linksWarning', {count: linksQueue});
    }

    const stats = [];
    stats.push({
        locale: '_',
        users: (await db.get(`SELECT count(*) AS c FROM users`)).c,
        data: {
            admins: (await db.get(`SELECT count(*) AS c FROM users WHERE roles!=''`)).c,
            userReports: (await db.get(`SELECT count(*) AS c FROM reports WHERE isHandled = 0`)).c,
            bansPending: (await db.get(`SELECT count(*) AS c FROM ban_proposals p LEFT JOIN users u ON p.userId = u.id WHERE u.bannedBy IS NULL`)).c,
            heartbeat: heartbeat['https://pronouns.page'],
            plausible: await checkPlausible('https://pronouns.page'),
            cardsQueue,
            linksQueue,
        },
    });

    for (let locale in allLocales) {
        if (!allLocales.hasOwnProperty(locale)) { continue; }

        const translations = new Suml().parse(fs.readFileSync(`${projectDir}/locale/${locale}/translations.suml`).toString());
        const missingTranslations = expectedTranslations.filter(key => deepGet(translations, key) === undefined).length;

        stats.push({
            locale,
            users: (await db.get(`SELECT count(*) as c FROM profiles WHERE locale='${locale}'`)).c,
            data: {
                nouns: {
                    approved: (await db.get(`SELECT count(*) AS c FROM nouns WHERE locale='${locale}' AND approved=1 AND deleted=0`)).c,
                    awaiting: (await db.get(`SELECT count(*) AS c FROM nouns WHERE locale='${locale}' AND approved=0 AND deleted=0`)).c,
                },
                inclusive: {
                    approved: (await db.get(`SELECT count(*) AS c FROM inclusive WHERE locale='${locale}' AND approved=1 AND deleted=0`)).c,
                    awaiting: (await db.get(`SELECT count(*) AS c FROM inclusive WHERE locale='${locale}' AND approved=0 AND deleted=0`)).c,
                },
                terms: {
                    approved: (await db.get(`SELECT count(*) AS c FROM terms WHERE locale='${locale}' AND approved=1 AND deleted=0`)).c,
                    awaiting: (await db.get(`SELECT count(*) AS c FROM terms WHERE locale='${locale}' AND approved=0 AND deleted=0`)).c,
                },
                sources: {
                    approved: (await db.get(`SELECT count(*) AS c FROM sources WHERE locale='${locale}' AND approved=1 AND deleted=0`)).c,
                    awaiting: (await db.get(`SELECT count(*) AS c FROM sources WHERE locale='${locale}' AND approved=0 AND deleted=0`)).c,
                },
                names: {
                    approved: (await db.get(`SELECT count(*) AS c FROM names WHERE locale='${locale}' AND approved=1 AND deleted=0`)).c,
                    awaiting: (await db.get(`SELECT count(*) AS c FROM names WHERE locale='${locale}' AND approved=0 AND deleted=0`)).c,
                },
                translations: {
                    missing: missingTranslations,
                    awaitingApproval: (await db.get(`SELECT count(*) AS c FROM translations WHERE locale='${locale}' AND status=0`)).c,
                    awaitingMerge:    (await db.get(`SELECT count(*) AS c FROM translations WHERE locale='${locale}' AND status=1`)).c,
                },
                plausible: await checkPlausible(allLocales[locale].url),
                heartbeat: heartbeat[allLocales[locale].url],
            }
        });
    }

    const DOUBLE_APOSTROPHE = "''";
    for (let statsLocale of stats) {
        await db.get(`INSERT INTO stats (id, locale, users, data) VALUES (
            '${id}',
            '${statsLocale.locale}',
            ${statsLocale.users},
            '${JSON.stringify(statsLocale.data).replace(/'/g, DOUBLE_APOSTROPHE)}'
        )`);
    }

    return stats;
}
