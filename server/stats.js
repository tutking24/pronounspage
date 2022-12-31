require('../src/dotenv')();

const dbConnection = require('./db');
const {calculateStats} = require('../src/stats');
const locales = require('../src/locales');
const fs = require('fs');
const buildLocaleList = require('../src/buildLocaleList');
const util = require('util');

async function calculate() {
    const db = await dbConnection();
    const stats = await calculateStats(db, buildLocaleList(null, true), __dirname + '/..');
    await db.close();

    console.log(util.inspect(stats, {showHidden: false, depth: null, colors: true}))
}

calculate();
