require('../src/dotenv')();

const dbConnection = require('./db');
const mailer = require('../src/mailer');
const {archiveBan} = require("./ban");

const execute = process.env.EXECUTE === '1';
console.log(execute ? 'WILL EXECUTE!' : 'Dry run');

const now = +new Date();
const month = 30*24*60*60*1000;
const week = 7*24*60*60*1000;

const sleep = ms => new Promise(res => setTimeout(res, ms));

async function warnInactive(db) {
    console.log('--- Fetching ids to warn ---');

    const users = (await db.all(`
        SELECT u.id, u.username, u.email, u.bannedReason
        FROM users u
        WHERE
            inactiveWarning IS NULL
            AND (
                (
                    u.id NOT IN (SELECT DISTINCT p.userId FROM profiles p)
                    AND (lastActive IS NULL OR lastActive < ${now - month})
                )
                OR bannedReason IS NOT NULL
            )
    `));

    console.log(users.length);

    for (let user of users) {
        console.log('warn', user);
        if (!execute) { continue; }
        if (user.email.endsWith('.oauth')) {
            await db.get(`UPDATE users SET inactiveWarning = ${now - week - 1000} WHERE id = '${user.id}'`);
            continue;
        }
        await db.get(`UPDATE users SET inactiveWarning = ${now} WHERE id = '${user.id}'`);
        if (user.bannedReason !== null) {
            continue;
        }
        mailer(user.email, 'inactivityWarning')
        await sleep(3000);
    }
}

async function removeWarned(db) {
    console.log('--- Fetching ids to remove ---');

    const users = (await db.all(`
        SELECT u.id, u.username, u.email
        FROM users u
        WHERE (
                u.id NOT IN (
                SELECT DISTINCT p.userId
                FROM profiles p
            )
            OR bannedReason IS NOT NULL
          )
          AND inactiveWarning IS NOT NULL
          AND inactiveWarning < ${now - week}
    `));

    console.log(users.length);

    for (let user of users) {
        console.log('remove', user);
        if (!execute) { continue; }
        await db.get(`DELETE FROM users WHERE id = '${user.id}'`);
    }
}

async function archiveBans(db) {
    console.log('--- Archiving banned accounts ---');

    const users = (await db.all(`
        SELECT u.id, u.username, u.email
        FROM users u
        WHERE u.bannedReason IS NOT NULL
    `));

    console.log(users.length);

    for (let user of users) {
        console.log('archiveBan', user);
        if (!execute) { continue; }
        await archiveBan(db, user);
    }
}

async function cleanup() {
    const db = await dbConnection();

    await db.get('PRAGMA foreign_keys = ON')

    await archiveBans(db); // TODO one-time only
    await warnInactive(db);
    await removeWarned(db);
}

cleanup();
