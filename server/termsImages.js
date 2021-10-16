require('../src/dotenv')();

const dbConnection = require('./db');

(async () => {
    const db = await dbConnection();
    const terms = {};
    for (let term of await db.all(`SELECT id, key, locale, flags, images FROM terms WHERE approved = 1 AND deleted = 0 AND key IS NOT NULL`)) {
        if (terms[term.locale] === undefined) { terms[term.locale] = {}; }
        terms[term.locale][term.key] = term;
    }
    for (let locale in terms) {
        if (!terms.hasOwnProperty(locale)) { continue; }
        if (locale === 'pl') { continue; }
        for (let key in terms[locale]) {
            if (!terms[locale].hasOwnProperty(key)) { continue; }
            const term = terms[locale][key];
            if (terms['pl'][term.key] === undefined) { continue; }
            const sql = `UPDATE terms SET flags = '${terms['pl'][term.key].flags.replace(/'/g, `''`)}', images = '${terms['pl'][term.key].images}' WHERE id = '${term.id}';`;
            console.log(sql);
            await db.get(sql);
        }
    }
})();
