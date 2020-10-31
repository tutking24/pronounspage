const dbConnection = require('./db');
require('dotenv').config({ path:__dirname + '/../.env' });
const mailer = require('./mailer');

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

    for (let admin of process.env.MAILER_ADMINS.split(',')) {
        console.log('Sending email to ' + admin)
        mailer(
            admin,
            '[Pronouns] Dictionary entries awaiting moderation: ' + JSON.stringify(awaitingModerationGrouped),
            JSON.stringify(awaitingModerationGrouped)
        );
    }
}

notify();
