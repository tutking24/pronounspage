const {decodeTime} = require('ulid');

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

const formatMonth = d => `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;

const buildChart = (rows) => {
    const dates = rows.map(row => new Date(decodeTime(row.id)));

    const chart = {};

    let loop = dates[0];
    const end = dates[dates.length - 1];
    while(loop <= end){
        chart[formatMonth(loop)] = 0;
        loop = new Date(loop.setDate(loop.getDate() + 1));
    }
    chart[formatMonth(loop)] = 0;

    for (let date of dates) {
        chart[formatMonth(date)]++;
    }

    return chart;
}

module.exports.statsFile = process.env.STATS_FILE.replace('%projectdir%', __dirname + '/..')

module.exports.calculateStats = async (db, allLocales) => {
    const users = {
        overall: (await db.get(`SELECT count(*) AS c FROM users`)).c,
        admins: (await db.get(`SELECT count(*) AS c FROM users WHERE roles!=''`)).c,
        chart: buildChart(await db.all(`SELECT id FROM users ORDER BY id`)),
    };

    const locales = {};
    for (let locale in allLocales) {
        if (!allLocales.hasOwnProperty(locale)) { continue; }

        const profiles = await db.all(`SELECT pronouns, flags FROM profiles WHERE locale='${locale}'`);
        const pronouns = {}
        const flags = {}
        for (let profile of profiles) {
            const pr = JSON.parse(profile.pronouns);
            for (let pronoun in pr) {
                if (!pr.hasOwnProperty(pronoun)) { continue; }

                if (pronoun.includes(',') || pr[pronoun] < 0) {
                    continue;
                }
                const p = pronoun.replace(/^.*:\/\//, '').replace(/^\//, '').toLowerCase().replace(/^[a-z]+\.[^/]+\//, '');
                if (pronouns[p] === undefined) {
                    pronouns[p] = 0;
                }
                pronouns[p] += pr[pronoun] === 1 ? 1 : 0.5;
            }

            const fl = JSON.parse(profile.flags);
            for (let flag of fl) {
                if (flags[flag] === undefined) {
                    flags[flag] = 0;
                }
                flags[flag] += 1;
            }
        }

        locales[locale] = {
            name: allLocales[locale].name,
            url: allLocales[locale].url,
            profiles: profiles.length,
            pronouns: sortByValue(pronouns, true, 36),
            flags: sortByValue(flags, true, 36),
            nouns: {
                approved: (await db.get(`SELECT count(*) AS c FROM nouns WHERE locale='${locale}' AND approved=1 AND deleted=0`)).c,
                awaiting: (await db.get(`SELECT count(*) AS c FROM nouns WHERE locale='${locale}' AND approved=0 AND deleted=0`)).c,
            },
            chart: buildChart(await db.all(`SELECT id FROM profiles WHERE locale='${locale}' ORDER BY id`)),
        };
    }

    return { calculatedAt: parseInt(new Date() / 1000), users, locales };
}
