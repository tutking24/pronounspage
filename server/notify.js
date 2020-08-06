const sqlite = require('sqlite');
const sqlite3 = require('sqlite3');
const mailer = require('mailer');
require('dotenv').config({ path:__dirname + '/../.env' });

async function notify() {
    const db = await sqlite.open({
        filename: __dirname + '/../data/db.sqlite',
        driver: sqlite3.Database,
    });

    const awaitingModeration = (await db.get(`SELECT count(*) as c FROM nouns WHERE approved = 0`)).c;
    if (!awaitingModeration) {
        console.log('No entries awaiting moderation');
        return;
    }

    console.log('Entries awaiting moderation: ' + awaitingModeration);

    for (let admin of process.env.MAILER_ADMINS.split(',')) {
        console.log('Sending email to ' + admin)
        mailer.send({
                host: process.env.MAILER_HOST,
                port: parseInt(process.env.MAILER_PORT),
                ssl: parseInt(process.env.MAILER_PORT) === 465,
                authentication: 'login',
                username: process.env.MAILER_USER,
                password: process.env.MAILER_PASS,
                from: process.env.MAILER_FROM,
                to: admin,
                subject: '[Zaimki.pl] Wpisy oczekują na moderację',
                body: 'Liczba wpisów: ' + awaitingModeration,
            },
            function(err, result){
                if (err) {
                    console.log(err);
                }
            });
    }
}

notify();
