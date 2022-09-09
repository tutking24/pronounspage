require('../src/dotenv')();

const dbConnection = require('./db');
const SQL = require('sql-template-strings');
const copyAvatar = require('./avatarCopy');

(async () => {
    const db = await dbConnection();
    const now = parseInt(+new Date / 1000);
    const auths = await db.all(SQL`
        SELECT * FROM authenticators
        WHERE type IN ('mastodon', 'indieauth', 'twitter', 'discord', 'google', 'facebook')
            AND (validUntil IS NULL OR validUntil > ${now})
    `)
    let i = 0;
    for (let auth of auths) {
        console.log(`${i++}/${auths.length} ${auth.userId} (${auth.type})`);
        const payload = JSON.parse(auth.payload);
        if (payload.avatarCopy || !payload.avatar) { continue; }
        const copyUrl = await copyAvatar(auth.type, payload.avatar);
        console.log(copyUrl);
        if (copyUrl) {
            payload.avatarCopy = copyUrl;
            await db.get(SQL`UPDATE authenticators SET payload = ${JSON.stringify(payload)} WHERE id = ${auth.id}`);
        }
    }
})();

// require('../src/dotenv')();
// const mailer = require('../src/mailer');
//
// mailer('andrea@avris.it', 'inactivityWarning', {username: 'foo'});

/*
require('../src/dotenv')();

const dbConnection = require('./db');
const SQL = require('sql-template-strings');

async function run() {
    const db = await dbConnection();

    const opinions = {
        '-1': 0,
        '0': 0,
        '1': 0,
        '2': 0,
        '3': 0,
    };

    let i = 0;
    const chunk = 10000;
    while (true) {
        console.log(i);
        const profiles = await db.all(SQL`SELECT * FROM profiles WHERE locale = 'en' AND birthday IS NOT NULL AND birthday > '2002-08-09' LIMIT ${chunk} OFFSET ${i};`)
        if (profiles.length === 0) { break; }
        i += chunk;

        for (let profile of profiles) {
            for (let words of JSON.parse(profile.words)) {
                for (let [word, opinion] of Object.entries(words)) {
                    if (word === 'enby') {
                        opinions[opinion.toString()]++;
                    }
                }
            }
        }
    }

    console.log(opinions);
}

run();

// const fetch = require('node-fetch');
//
// apiKey = ''
// async function main() {
//     const res = await fetch(`https://plausible.avris.it/api/v1/stats/aggregate?site_id=${'en.pronouns.page'}&period=30d&metrics=visitors,pageviews`, {
//         headers: {
//             'Authorization': `Bearer ${apiKey}`,
//         }
//     });
//     console.log(await res.json());
// }
// main();

/*
require('../src/dotenv')();

const dbConnection = require('./db');
const SQL = require('sql-template-strings');
const fs = require('fs');
const Suml = require('suml');

const translations = {};

async function update(flag) {
    const db = await dbConnection();

    let count = 0;
    for (let {id, locale, flags, customFlags} of await db.all(SQL`SELECT id, locale, flags, customFlags FROM profiles WHERE flags like ${'%"' + flag + '"%'}`)) {
        if (translations[locale] === undefined) {
            translations[locale] = new Suml().parse(fs.readFileSync(`./locale/${locale}/translations.suml`).toString())
        }

        flags = JSON.parse(flags);
        customFlags = JSON.parse(customFlags);

        let translation = translations[locale].flags;
        translation = translation === undefined ? flag : translation[flag];
        translation = translation.replace(/{.*?}/g, '_');

        flags = flags.filter(f => f !== flag);
        customFlags = {
            '01FHY8BWGFWXHF71F00GS8RGW2': translation,
            ...customFlags,
        };

        await db.get(SQL`UPDATE profiles SET flags = ${JSON.stringify(flags)}, customFlags = ${JSON.stringify(customFlags)} WHERE id = ${id};`)
        count++;
    }
    console.log('Updated', flag, count);
}

update('Monoamorous'); // TODO
update('Monogamous'); // TODO
*/
