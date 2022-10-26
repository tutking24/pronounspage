require('../src/dotenv')();

const Pageres = require('pageres');
const isHighLoadTime = require('./overload');
const dbConnection = require('./db');
const locales = require('../src/locales');
const { ulid } = require('ulid');

const awsConfig = require('./aws');
const S3 = require('aws-sdk/clients/s3');
const s3 = new S3(awsConfig);

const urlBases = {}
for (let [code, , url, ] of locales) {
    urlBases[code] = url + '/card/@'; // 'http://localhost:3000/card/@'
}
const domainLocaleMap = {};
for (let [code, , url, ] of locales) {
    domainLocaleMap[url.replace(/^https?:\/\//, '')] = code;
}

const sleep = ms => new Promise(res => setTimeout(res, ms));

const modes = ['light', 'dark'];

const shoot = async (db, mode) => {
    const profiles = (await db.all(`
            SELECT profiles.id, profiles.locale, users.username
            FROM profiles
            LEFT JOIN users on profiles.userId = users.id
            WHERE profiles.${mode === 'dark' ? 'cardDark' : 'card'} = ''
            ORDER BY RANDOM()
            LIMIT 6
        `)).filter(({locale}) => !isHighLoadTime(locale));

    if (profiles.length === 0) {
        console.log('No profiles in the queue');
        return;
    }

    const results = {}

    try {
        const pr = new Pageres({
            darkMode: mode === 'dark',
            delay: 3,
            scale: 1.5,
        });

        for (let {locale, username} of profiles) {
            console.log(`Shooting @${username} (${locale}, ${mode})`);
            pr.src(urlBases[locale] + username, ['1024x300'])
        }

        for (let buffer of await pr.run()) {
            const [, domain, username] = buffer.filename.match(/(.*)!card!@(.*)-1024x300\.png/);
            const locale = domainLocaleMap[domain];
            results[locale + '/' + username] = buffer;
        }
    } catch (e) {
        console.error(e);
        return;
    }

    for (let {id, locale, username} of profiles) {
        const cardId = ulid();
        let key = `card/${locale}/${encodeURIComponent(username).replace(/'/g, '_')}-${cardId}.png`;
        if (mode === 'dark') {
            key = mode === 'dark' ? key.replace('.png', '-dark.png') : key;
        }

        console.log(`Uploading @${username} (${locale}, ${mode}) – ${cardId}`);

        const buffer = results[locale + '/' + username.replace(/\.+$/, '')];

        if (buffer === undefined) {
            console.error('Cannot find the proper buffer!');
            continue;
        }

        const s3putResponse = await s3.putObject({
            Key: key,
            Body: buffer,
            ContentType: 'image/png',
            ACL: 'public-read',
        }).promise();

        await db.get(`
            UPDATE profiles
            SET ${mode === 'dark' ? 'cardDark' : 'card'}='https://${awsConfig.params.Bucket}.s3.${awsConfig.region}.amazonaws.com/${key}'
            WHERE id='${id}'`
        );
    }
}

(async () => {
    const db = await dbConnection();
    while (true) {
        for (let mode of modes) {
            await sleep(3000);
            console.log(`Starting mode: ${mode}`)
            await shoot(db, mode);
        }
    }
})();
