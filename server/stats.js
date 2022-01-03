require('../src/dotenv')();

const dbConnection = require('./db');
const {calculateStats, statsFile} = require('../src/stats');
const locales = require('../src/locales');
const fs = require('fs');
const buildLocaleList = require('../src/buildLocaleList');

async function calculate() {
    const db = await dbConnection();
    const stats = await calculateStats(db, buildLocaleList());
    await db.close();

    console.log(stats);
    fs.writeFileSync(statsFile, JSON.stringify(stats));
}

calculate();
