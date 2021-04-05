const dbConnection = require('./db');
require('dotenv').config({ path:__dirname + '/../.env' });
const mailer = require('../src/mailer');

// TODO duplication...
const isGranted = (user, locale, area) => {
    if (area === '*') {
        return user.roles.split('|').includes('*');
    }

    for (let permission of user.roles.split('|')) {
        if (permission === '*') {
            return true;
        }
        const [ permissionLocale, permissionArea ] = permission.split('-');
        if ((permissionLocale === '*' || permissionLocale === locale) && (permissionArea === '*' || permissionArea === area)) {
            return true;
        }
    }

    return false;
}

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

    const admins = await db.all(`SELECT email, roles FROM users WHERE roles != ''`);

    const awaitingModerationGrouped = {}
    let count = 0;
    for (let m of awaitingModeration) {
        for (let admin of admins) {
            if (isGranted(admin, m.locale, m.type)) {
                if (awaitingModerationGrouped[admin.email] === undefined) {
                    awaitingModerationGrouped[admin.email] = {};
                }
                awaitingModerationGrouped[admin.email][m.locale + '-' + m.type] = m.c;
            }
        }
        count += m.c;
    }

    console.log('Entries awaiting moderation: ', count);

    for (let email in awaitingModerationGrouped) {
        if (!awaitingModerationGrouped.hasOwnProperty(email)) {
            continue;
        }
        const message = awaitingModerationGrouped[email];
        console.log('Sending email:', email, message);

        mailer(
            email,
            '[Pronouns.page] There are entries awaiting moderation',
            'Entries awaiting moderation: \n' + JSON.stringify(message, null, 4),
        );
    }
}

notify();
