const sqlite = require('sqlite');
const sqlite3 = require('sqlite3');
const ulid = require('ulid').ulid;

const fixtures = [
    ['pan', 'pani', 'panu|państwo', 'panowie', 'panie', 'państwo'],
    ['ojciec', 'matka', 'rodzic', 'ojcowie', 'matki', 'rodzice'],
    ['filolog', 'filolożka', 'filologum', 'filologowie', 'filolożki', 'filologa'],
];

async function initDb () {
    const db = await sqlite.open({
        filename: __dirname + '/../data/db.sqlite',
        driver: sqlite3.Database,
    });

    await db.exec(`DROP TABLE IF EXISTS nouns`);
    await db.exec(`CREATE TABLE nouns (
        id TEXT NOT NULL PRIMARY KEY,
        masc TEXT NOT NULL,
        fem TEXT NOT NULL,
        neutr TEXT NOT NULL,
        mascPl TEXT NOT NULL,
        femPl TEXT NOT NULL,
        neutrPl TEXT NOT NULL,
        approved INTEGER NOT NULL,
        base_id TEXT
    )`);

    for (let fixture of fixtures) {
        await db.get('INSERT OR REPLACE INTO nouns VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', ulid(), ...fixture, 1, null);
    }
}

initDb();
