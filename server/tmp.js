require('../src/dotenv')();

const dbConnection = require('./db');
const SQL = require('sql-template-strings');

(async () => {
    const db = await dbConnection();

    const profiles = await db.all(SQL`SELECT * FROM profiles WHERE links not like '[%'`);
    let i = 0;
    for (let profile of profiles) {
        if (i % 1000 === 0) {
            console.log(`${i}/${profiles.length}`);
            i++;
        }
        const links = profile.links.split(',');
        const newLinks = JSON.stringify(links);
        const sql = SQL`UPDATE profiles SET links = ${newLinks} WHERE id = ${profile.id}`;
        await db.get(sql);
    }
})();
