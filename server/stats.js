const dbConnection = require('./db');
require('dotenv').config({ path:__dirname + '/../.env' });
const {calculateStats, statsFile} = require('../src/stats');
const locales = require('../src/locales');
const fs = require('fs');

// TODO duplication
const buildDict = (fn, ...args) => {
    const dict = {};
    for (let [key, value] of fn(...args)) {
        dict[key] = value;
    }
    return dict;
}
const buildLocaleList = () => {
    return buildDict(function* () {
        for (let [code, name, url, published] of locales) {
            if (published) {
                yield [code, {name, url, published}];
            }
        }
    })
}

async function calculate() {
    const db = await dbConnection();
    const stats = await calculateStats(db, buildLocaleList());
    await db.close();

    console.log(stats);
    fs.writeFileSync(statsFile, JSON.stringify(stats));
}

calculate();
