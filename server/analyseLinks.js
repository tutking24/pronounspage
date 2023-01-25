require('../src/dotenv')();

const dbConnection = require('./db');
const SQL = require('sql-template-strings');
const { LinkAnalyser } = require('../src/links');


const timer = ms => new Promise( res => setTimeout(res, ms));

(async () => {
    const analyser = new LinkAnalyser();
    const db = await dbConnection();
    while (true) {
        const chunk = await db.all(SQL`SELECT url FROM links WHERE (expiresAt IS NULL OR expiresAt <= ${new Date() / 1000}) LIMIT 16`);
        console.log(`Fetching ${chunk.length} links: (${chunk.map(l => l.url).join(', ')})`);
        if (chunk.length === 0) {
            await timer(1000);
            continue;
        }
        const results = await Promise.all(chunk.map(({url}) => analyser.analyse(url)));
        for (let result of results) {
            if (result.error) {
                await db.get(SQL`UPDATE links SET expiresAt = ${(new Date() / 1000) + 7*24*60*60} WHERE url=${result.url}`);
            } else {
                await db.get(SQL`UPDATE links
                    SET expiresAt = ${(new Date() / 1000) + 7*24*60*60},
                        favicon = ${result.favicon},
                        relMe = ${JSON.stringify(result.relMe)},
                        nodeinfo = ${JSON.stringify(result.nodeinfo)}
                    WHERE url=${result.url}`);
            }
        }
    }
})();
