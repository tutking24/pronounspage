require('../src/dotenv')();

const dbConnection = require('./db');
const SQL = require('sql-template-strings');
const Suml = require('suml');
const fs = require("fs");

const loadSuml = name => new Suml().parse(fs.readFileSync(`${__dirname}/../data/${name}.suml`).toString());
const config = loadSuml('config');

const isTroll = (answers, writins) => {
    if (Object.values(writins).filter(x => !!x).length) {
        return null; // unknown, send to moderation
    }

    for (let i in config.census.questions) {
        if (config.census.questions[i].type === 'textarea' && answers[i.toString()]) {
            return null; // unknown, send to moderation
        }
    }

    return false; // no free-text provided
}

const boolToInt = (value) => {
    if (value === null) { return null; }
    if (value === true) { return 1; }
    if (value === false) { return 0; }
    throw `Invalid value ${value}`
}

(async () => {
    const db = await dbConnection();

    const responses = await db.all(SQL`SELECT * FROM census WHERE edition = 2023 and locale='pl'`);
    for (let response of responses) {
        const troll = isTroll(JSON.parse(response.answers), JSON.parse(response.writins));
        await db.get(SQL`UPDATE census SET troll = ${boolToInt(troll)} WHERE id = ${response.id}`);
    }
})();
