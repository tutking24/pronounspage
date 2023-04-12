require('../src/dotenv')();

const dbConnection = require('./db');
const SQL = require("sql-template-strings");
const {ulid, decodeTime} = require('ulid');
const mailer = require('../src/mailer')

const CAMPAIGNS = [
    {
        name: 'spis-2023',
        sendAt: new Date(2023, 1, 1, 9, 0, 0),
        type: 'census',
        locales: ['pl'],
        subject: 'Ruszyła trzecia edycja Niebinarnego Spisu Powszechnego!',
        text: `Jak co roku, luty jest miesiącem, w którym zbieramy dane na temat języka używanego przez polskojęzyczne osoby niebinarne.
        
Serdecznie zapraszamy do udziału w Niebinarnym Spisie Powszechnym! By wesprzeć naszą społeczność, wystarczy wejść na https://zaimki.pl/spis i wypełnić formularz 😉

(Ta wiadomość wysyłana jest do osób, które zapisały się na przypominajkę. Jeśli chcesz z niej zrezygnować, wejdź na https://zaimki.pl/api/subscription/unsubscribe?email={{emailEncoded}}&type=census)
        `,
        html: `
            <p>Jak co roku, luty jest miesiącem, w którym zbieramy dane na temat języka używanego przez polskojęzyczne osoby niebinarne.</p>
            <p>Serdecznie zapraszamy do udziału w Niebinarnym Spisie Powszechnym! By wesprzeć naszą społeczność, wystarczy wejść na <a href="https://zaimki.pl/spis">zaimki.pl/spis</a> i wypełnić formularz 😉</p>
            <p style="text-align: center; padding-top: 16px; padding-bottom: 16px;">
                <a href="https://zaimki.pl/spis" target="_blank" rel="noopener" style="background-color: #C71585; color: #fff; padding: 8px 16px; border: none; border-radius: 6px;text-decoration: none">
                    zaimki.pl/spis
                </a>
            </p>
            <p style="color: #999; font-size: 10px;">Ta wiadomość wysyłana jest do osób, które zapisały się na przypominajkę. Jeśli chcesz z niej zrezygnować, <a href="https://zaimki.pl/api/subscription/unsubscribe?email={{emailEncoded}}&type=census">kliknij tutaj</a>.</p>
        `,
    },
    {
        name: 'spis-2023-raport',
        sendAt: new Date(2023, 3, 12, 12, 0, 0),
        type: 'census',
        locales: ['pl'],
        subject: 'Przedstawiamy raport z trzeciej edycji Niebinarnego Spisu Powszechnego!',
        text: `Już po raz trzeci przeprowadziłośmy Niebinarny Spis Powszechny – największe badanie języka, jakim posługują się polskojęzyczne osoby niebinarne.

W tym roku udało nam się zebrać rekordową liczbę odpowiedzi, aż 3022! Rozszerzyłośmy też ankietę o kilka dodatkowych pytań i porównałośmy wyniki z dwiema poprzednimi edycjami. Zaowocowało to najbardziej rozbudowanym raportem o niebinarszczyźnie!

Report dostępny jest pod adresem https://zaimki.pl/blog/spis-2023 – serdecznie zapraszamy do lektury 😉

(Ta wiadomość wysyłana jest do osób, które zapisały się na przypominajkę. Jeśli chcesz z niej zrezygnować, wejdź na https://zaimki.pl/api/subscription/unsubscribe?email={{emailEncoded}}&type=census)
        `,
        html: `
            <p>Już po raz trzeci przeprowadziłośmy Niebinarny Spis Powszechny – największe badanie języka, jakim posługują się polskojęzyczne osoby niebinarne.</p>
            <p>W tym roku udało nam się zebrać rekordową liczbę odpowiedzi, aż 3022! Rozszerzyłośmy też ankietę o kilka dodatkowych pytań i porównałośmy wyniki z dwiema poprzednimi edycjami. Zaowocowało to najbardziej rozbudowanym raportem o niebinarszczyźnie!</p>
            <p>Report dostępny jest pod adresem <a href="https://zaimki.pl/blog/spis-2023" target="_blank" rel="noopener">zaimki.pl/blog/spis-2023</a> – serdecznie zapraszamy do lektury 😉</p>
            <p style="text-align: center; padding-top: 16px; padding-bottom: 16px;">
                <a href="https://zaimki.pl/blog/spis-2023" target="_blank" rel="noopener" style="background-color: #C71585; color: #fff; padding: 8px 16px; border: none; border-radius: 6px;text-decoration: none">
                    zaimki.pl/blog/spis-2023
                </a>
            </p>
            <p style="color: #999; font-size: 10px;">Ta wiadomość wysyłana jest do osób, które zapisały się na przypominajkę. Jeśli chcesz z niej zrezygnować, <a href="https://zaimki.pl/api/subscription/unsubscribe?email={{emailEncoded}}&type=census">kliknij tutaj</a>.</p>
        `,
    }
];

async function calculate() {
    const db = await dbConnection();

    const sent = {};
    for (let {subscription_id, campaign} of await db.all(SQL`SELECT * FROM subscription_messages`)) {
        if (sent[subscription_id] === undefined) {
            sent[subscription_id] = [];
        }
        sent[subscription_id].push(campaign);
    }

    const now = new Date();

    for (let {id, locale, type, email} of await db.all(SQL`SELECT * FROM subscriptions`)) {
        const campaign = CAMPAIGNS.filter(n => {
            return n.type === type
                && now >= n.sendAt
                && decodeTime(id) <= n.sendAt // don't send to people who signed up after send date
                && (n.locales === undefined || n.locales.includes(locale))
                && !(sent[id] || []).includes(n.name)
            ;
        })?.[0];

        if (!campaign) { continue; }

        console.log(`Sending to ${email}`)

        await mailer(email, campaign, {
            emailEncoded: encodeURIComponent(email),
        });

        await db.get(SQL`INSERT INTO subscription_messages (id, subscription_id, campaign)
            VALUES (${ulid()}, ${id}, ${campaign.name})`);
    }

    await db.close();
}

calculate();
