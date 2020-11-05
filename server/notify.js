const dbConnection = require('./db');
require('dotenv').config({ path:__dirname + '/../.env' });
const mailer = require('../src/mailer');

async function notify() {
    const db = await dbConnection();

    const awaitingModeration = (await db.all(`SELECT locale, count(*) as c FROM nouns WHERE approved = 0 GROUP BY locale`));
    if (!awaitingModeration.length) {
        console.log('No entries awaiting moderation');
        return;
    }

    const awaitingModerationGrouped = {}
    for (let m of awaitingModeration) {
        awaitingModerationGrouped[m.locale] = m.c;
    }

    console.log('Entries awaiting moderation: ', awaitingModerationGrouped);

    const admins = await db.all(`SELECT email FROM users WHERE roles = 'admin'`);

    for (let { email } of admins) {
        console.log('Sending email to ' + email)
        mailer(
            email,
            '[Pronouns] Dictionary entries awaiting moderation: ' + JSON.stringify(awaitingModerationGrouped),
            JSON.stringify(awaitingModerationGrouped)
        );
    }
}

notify();
