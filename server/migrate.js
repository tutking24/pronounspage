const dbConnection = require('./db');

async function migrate() {
    const db = await dbConnection();
    await db.migrate({migrationsPath: __dirname + '/../migrations'})
    await db.close();
}

migrate();

// temporary code for a non-sqlite migration:
const normalise = s => s.trim().toLowerCase();

async function populateUsernameNorm() {
    const db = await dbConnection();
    for ({id, username} of await db.all(`SELECT id, username FROM users WHERE usernameNorm IS NULL`)) {
        const norm = normalise(username); // username is safe, so so will be norm
        console.log(username, norm)
        await db.all(`UPDATE users SET usernameNorm = '${norm}' WHERE id = '${id}'`);
    }
    await db.close();
}
populateUsernameNorm();
