require('../src/dotenv')();

const dbConnection = require('./db');
const {buildChart} = require('../src/stats');
const locales = require('../src/locales');
const fs = require('fs');
const buildLocaleList = require('../src/buildLocaleList');
const util = require('util')
const ulid = require('ulid').ulid;

const log = (val) => console.log(util.inspect(val, {showHidden: false, depth: null, colors: true}))

const saveLegacyStats = async (db, locale, chart) => {
    for (let [date, count] of Object.entries(chart)) {
        const id = ulid(+new Date(
            parseInt(date.substring(0, 4)),
            parseInt(date.substring(5, 7)) - 1,
            parseInt(date.substring(8, 10)),
        ));
        await db.get(`INSERT INTO stats (id, locale, users, data) VALUES (
            '${id}',
            '${locale}',
            ${count},
            '{}'
        )`);
    }
}

async function calculate() {
    const db = await dbConnection();
    console.log('_');
    const usersChart = buildChart(await db.all(`SELECT id FROM users ORDER BY id ASC`));
    await saveLegacyStats(db, '_', usersChart);

    for (let locale in buildLocaleList(null, true)) {
        console.log(locale);
        const chart = buildChart(await db.all(`SELECT id FROM profiles WHERE locale = '${locale}' ORDER BY id ASC`));
        await saveLegacyStats(db, locale, chart);
    }

    await db.close();
}

calculate();
