require('../src/dotenv')();

const dbConnection = require('./db');
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
        if ((permissionLocale === '*' || permissionLocale === locale || locale === null) && (permissionArea === '*' || permissionArea === area)) {
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
        ...(await db.all(`SELECT 'terms' as type, locale, count(*) as c FROM terms WHERE approved = 0 AND deleted=0 GROUP BY locale`)),
        ...(await db.all(`SELECT 'sources' as type, locale, count(*) as c FROM sources WHERE approved = 0 AND deleted=0 GROUP BY locale`)),
        ...(await db.all(`SELECT 'names' as type, locale, count(*) as c FROM names WHERE approved = 0 AND deleted=0 GROUP BY locale`)),
        ...(await db.all(`SELECT 'reports' as type, null as locale, count(*) as c FROM reports WHERE isHandled = 0`)),
    ].filter(r => r.c > 0);
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
                awaitingModerationGrouped[admin.email][(m.locale || '*') + '-' + m.type] = m.c;
            }
        }
        count += m.c;
    }

    console.log('Entries awaiting moderation: ', count);

    for (let email in awaitingModerationGrouped) {
        if (!awaitingModerationGrouped.hasOwnProperty(email)) {
            continue;
        }
        const stats = awaitingModerationGrouped[email];
        console.log('Sending email:', email, stats);

        mailer(email, 'notify', { stats });
    }

    await db.close();
}

notify();
