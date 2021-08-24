const dbConnection = require('./db');
require('dotenv').config({ path:__dirname + '/../.env' });
const awsConfig = require('./aws');
const S3 = require('aws-sdk/clients/s3');

const execute = process.env.EXECUTE === '1';

console.log(execute ? 'WILL REMOVE FILES!' : 'Dry run');

async function cleanup() {
    console.log('--- Fetching ids expected to stay ---');
    const db = await dbConnection();

    const avatars = (await db.all(`
        SELECT avatarSource
        FROM users
        WHERE avatarSource LIKE 'https://pronouns-page.s3-eu-west-1.amazonaws.com/images/%'`
    )).map(row => row.avatarSource.match('https://pronouns-page.s3-eu-west-1.amazonaws.com/images/(.*)-thumb.png')[1]);

    const flags = [];
    for (let row of await db.all(`
        SELECT customFlags
        FROM profiles
        WHERE customFlags != '{}'
    `)) {
        for (let key of Object.keys(JSON.parse(row.customFlags))) {
            flags.push(key);
        }
    }

    const sources = [];
    for (let row of await db.all(`
        SELECT images
        FROM sources
        WHERE images is not null AND images != ''
    `)) {
        for (let key of row.images.split(',')) {
            sources.push(key);
        }
    }

    const terms = [];
    for (let row of await db.all(`
        SELECT images
        FROM terms
        WHERE images is not null AND images != ''
    `)) {
        for (let key of row.images.split(',')) {
            terms.push(key);
        }
    }

    console.log('Avatars: ' + avatars.length);
    console.log('Flags: ' + flags.length);
    console.log('Sources: ' + sources.length);
    console.log('Terms: ' + terms.length);

    await db.close();

    console.log('--- Cleaning up S3 ---');
    const s3 = new S3(awsConfig);
    let overall = 0;
    let fresh = 0;
    let removed = 0;
    let removedSize = 0;

    const chunkSize = 1000;
    let marker = undefined;
    while (true) {
        console.log('Making a request');
        const objects = await s3.listObjects({
            Prefix: `images/`,
            MaxKeys: chunkSize,
            Marker: marker,
        }).promise();

        const toRemove = [];
        const remove = async (object, reason) => {
            console.log(`REMOVING: ${object.Key} (${reason})`);
            toRemove.append({Key: object.Key});
            removed += 1;
            removedSize += object.Size;
        }

        for (let object of objects.Contents) {
            overall++;
            marker = object.Key;

            if (object.LastModified > new Date() - 60*60*1000) {
                fresh++;
                continue;
            }

            const [, id, size] = object.Key.match('images/(.*)-(.*).png');

            if (avatars.includes(id)) {
                if (size !== 'thumb') {
                    await remove(object, 'avatar');
                }
            } else if (flags.includes(id)) {
                if (size !== 'flag') {
                    await remove(object, 'flag');
                }
            } else if (sources.includes(id)) {
                if (size !== 'big' && size !== 'thumb') {
                    await remove(object, 'source');
                }
            } else if (terms.includes(id)) {
                if (size !== 'big' && size !== 'thumb') {
                    await remove(object, 'term');
                }
            } else {
                await remove(object, 'not used');
            }
        }

        if (execute && toRemove.length) {
            console.log('--- Removal request ---');
            await s3.deleteObjects({
                Delete: {
                    Objects: toRemove,
                }
            });
        }

        if (objects.Contents.length < chunkSize) {
            break;
        }
    }

    console.log('--- Summary ---');
    console.log('Overall: ' + overall);
    console.log('Fresh: ' + fresh);
    console.log('Removed: ' + removed);
    console.log(`Removed size: ${Math.round(removedSize / 1024 / 1024)} MB`);
}

cleanup();
