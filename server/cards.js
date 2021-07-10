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

(async () => {
    const db = await dbConnection();
    for (let {id, locale, username} of await db.all('SELECT profiles.id, profiles.locale, users.username FROM profiles LEFT JOIN users on profiles.userId = users.id WHERE profiles.card IS NULL')) {
        if (isHighLoadTime(locale)) {
            continue;
        }
        // if (locale !== 'pl' || username !== 'andrea') { continue; }

        const cardId = ulid();
        const key = `card/${locale}/${username}-${cardId}.png`;

        console.log(locale, username, cardId);

        for (let dark of [false, true]) {
            const [ buffer ] = await new Pageres({ darkMode: dark })
                .src(urlBases[locale] + username, ['1024x300'])
                .run();

            const s3putResponse = await s3.putObject({
                Key: dark ? key.replace('.png', '-dark.png') : key,
                Body: buffer,
                ContentType: 'image/png',
                ACL: 'public-read',
            }).promise();
        }

        await db.get(`UPDATE profiles SET card='https://${awsConfig.params.Bucket}.s3.${awsConfig.region}.amazonaws.com/${key}' WHERE id='${id}'`)
        // '/card/@${username}.png'
    }
})();
