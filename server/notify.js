const dbConnection = require('./db');
require('dotenv').config({ path:__dirname + '/../.env' });
const mailer = require('./mailer');

async function notify() {
    const db = await dbConnection();

    const awaitingModeration = (await db.get(`SELECT count(*) as c FROM nouns WHERE approved = 0`)).c;
    if (!awaitingModeration) {
        console.log('No entries awaiting moderation');
        return;
    }

    console.log('Entries awaiting moderation: ' + awaitingModeration);

    for (let admin of process.env.MAILER_ADMINS.split(',')) {
        console.log('Sending email to ' + admin)
        mailer(admin, '[Zaimki.pl] Wpisy oczekują na moderację', 'Liczba wpisów: ' + awaitingModeration);
    }
}

notify();
