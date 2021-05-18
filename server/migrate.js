const dbConnection = require('./db');

async function migrate() {
    const db = await dbConnection();
    await db.migrate({migrationsPath: __dirname + '/../migrations'})
    await db.close();
}

migrate();
