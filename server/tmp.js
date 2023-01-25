require('../src/dotenv')();

const dbConnection = require('./db');
const SQL = require('sql-template-strings');
const {normaliseUrl} = require('../src/links');

(async () => {
    const db = await dbConnection();

    const profiles = await db.all(SQL`SELECT links FROM profiles`);
    let i = 0;
    for (let {links} of profiles) {
        if (i % 1000 === 0) {
            console.log(`${i}/${profiles.length}`);
        }
        i++;
        for (let url of JSON.parse(links)) {
            url = normaliseUrl(url);
            if (!url) { continue; }
            await db.get(SQL`INSERT INTO links (url) VALUES (${url}) ON CONFLICT (url) DO UPDATE SET expiresAt = null`);
        }
    }
})();
