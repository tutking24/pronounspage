require('dotenv').config({ path:__dirname + '/../.env' });
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

const sleep = ms => new Promise(res => setTimeout(res, ms));

const modes = ['light', 'dark'];

(async () => {
    const db = await dbConnection();
    while (true) {
        const profiles = (await db.all(`
            SELECT profiles.id, profiles.locale, users.username
            FROM profiles
                     LEFT JOIN users on profiles.userId = users.id
            WHERE profiles.card IS NULL
            ORDER BY RANDOM()
            LIMIT 8
        `)).filter(({locale}) => !isHighLoadTime(locale));

        if (profiles.length === 0) {
            console.log('No profiles in the queue');
            await sleep(5000);
            continue;
        }

        const results = {
            'light': {},
            'dark': {},
        }

        try {
            for (let mode of modes) {
                const pr = new Pageres({
                    darkMode: mode === 'dark',
                    delay: 3,
                });

                for (let {locale, username} of profiles) {
                    console.log(`Shooting @${username} (${locale}, ${mode})`);
                    pr.src(urlBases[locale] + username, ['1024x300'])
                }

                for (let buffer of await pr.run()) {
                    const username = buffer.filename.match(/!card!@(.*)-1024x300\.png/)[1];
                    results[mode][username] = buffer;
                }
            }
        } catch (e) {
            console.error(e);
            continue;
        }

        for (let {id, locale, username} of profiles) {
            const cardId = ulid();
            const key = `card/${locale}/${username}-${cardId}.png`;
            for (let mode of modes) {
                console.log(`Uploading @${username} (${locale}, ${mode}) – ${cardId}`);
                const buffer = results[mode][username];

                const s3putResponse = await s3.putObject({
                    Key: mode === 'dark' ? key.replace('.png', '-dark.png') : key,
                    Body: buffer,
                    ContentType: 'image/png',
                    ACL: 'public-read',
                }).promise();
            }

            await db.get(`UPDATE profiles SET card='https://${awsConfig.params.Bucket}.s3.${awsConfig.region}.amazonaws.com/${key}' WHERE id='${id}'`)
        }
    }
})();
