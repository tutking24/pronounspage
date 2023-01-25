require('../src/dotenv')();

const dbConnection = require('./db');
const SQL = require('sql-template-strings');
const { LinkAnalyser } = require('../src/links');

const timer = ms => new Promise( res => setTimeout(res, ms));

(async () => {
    const analyser = new LinkAnalyser();
    const db = await dbConnection();
    while (true) {
        const chunk = await db.all(SQL`SELECT url FROM links WHERE (expiresAt IS NULL OR expiresAt <= ${new Date() / 1000}) ORDER BY RANDOM() LIMIT 64`);
        console.log(`Fetching ${chunk.length} links: (${chunk.map(l => l.url).join(', ')})`);
        if (chunk.length === 0) {
            await timer(1000);
            continue;
        }
        const results = await Promise.all(chunk.map(({url}) => Promise.race([
            analyser.analyse(url),
            new Promise((resolve, reject) =>
                setTimeout(() => resolve({url: url, error: new Error('timeout')}), 12000)
            ),
        ])));
        for (let result of results) {
            // random TTL (0-30 days) in order to spread out the legacy load
            const expireAt = parseInt(new Date() / 1000) + parseInt(30*24*60*60*Math.random());
            if (result.error) {
                console.error(result);
                await db.get(SQL`UPDATE links SET expiresAt = ${expireAt} WHERE url=${result.url}`);
            } else {
                await db.get(SQL`UPDATE links
                    SET expiresAt = ${expireAt},
                        favicon = ${result.favicon},
                        relMe = ${JSON.stringify(result.relMe)},
                        nodeinfo = ${JSON.stringify(result.nodeinfo)}
                    WHERE url=${result.url}`);
            }
        }
    }
})();
