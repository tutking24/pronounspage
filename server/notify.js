const dbConnection = require('./db');
require('dotenv').config({ path:__dirname + '/../.env' });
const mailer = require('../src/mailer');

async function notify() {
    const db = await dbConnection();

    const awaitingModeration = [
        ...(await db.all(`SELECT 'nouns' as type, locale, count(*) as c FROM nouns WHERE approved = 0 AND deleted=0 GROUP BY locale`)),
        ...(await db.all(`SELECT 'inclusive' as type, locale, count(*) as c FROM inclusive WHERE approved = 0 AND deleted=0 GROUP BY locale`)),
        ...(await db.all(`SELECT 'sources' as type, locale, count(*) as c FROM sources WHERE approved = 0 AND deleted=0 GROUP BY locale`)),
    ];
    if (!awaitingModeration.length) {
        console.log('No entries awaiting moderation');
        return;
    }

    const awaitingModerationGrouped = {}
    let count = 0;
    for (let m of awaitingModeration) {
        awaitingModerationGrouped[m.type + '-' + m.locale] = m.c;
        count += m.c;
    }

    console.log('Entries awaiting moderation: ', awaitingModerationGrouped);

    const admins = await db.all(`SELECT email FROM users WHERE roles = 'admin'`);

    for (let { email } of admins) {
        console.log('Sending email to ' + email)
        mailer(
            email,
            '[Pronouns.page] Entries awaiting moderation: ' + count,
            'Entries awaiting moderation: \n' + JSON.stringify(awaitingModerationGrouped, null, 4),
        );
    }
}

notify();
