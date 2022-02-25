const SQL = require('sql-template-strings');
const socialLoginConfig = require('./social').config;

const upsertBanArchive = async (db, type, value) => {
    await db.get(SQL`INSERT INTO bans (type, value) VALUES (${type}, ${value}) ON CONFLICT DO NOTHING`);
}

const removeBanArchive = async (db, type, value) => {
    await db.get(SQL`DELETE FROM bans WHERE type = ${type} AND value = ${value};`);
}

const normaliseEmail = (email) => {
    let [username, domain] = email.split('@');
    username = username.replace(/\.+/g, '');
    username = username.replace(/\+.*/, '');
    return `${username}@${domain}`.toLowerCase();
};

module.exports.archiveBan = async (db, user) => {
    for (let auth of await db.all(SQL`SELECT * FROM authenticators WHERE userId = ${user.id}`)) {
        const p = JSON.parse(auth.payload);
        if (auth.type === 'email') {
            await upsertBanArchive(db, 'email', normaliseEmail(p.email));
        } else if (socialLoginConfig[auth.type] !== undefined) {
            await upsertBanArchive(db, auth.type, p.id);
            if (p.email) {
                await upsertBanArchive(db, 'email', normaliseEmail(p.email));
            }
        }
    }
}

module.exports.liftBan = async (db, user) => {
    for (let auth of await db.all(SQL`SELECT * FROM authenticators WHERE userId = ${user.id}`)) {
        const p = JSON.parse(auth.payload);
        if (auth.type === 'email') {
            await removeBanArchive(db, 'email', normaliseEmail(p.email));
        } else if (socialLoginConfig[auth.type] !== undefined) {
            await removeBanArchive(db, auth.type, p.id);
            if (p.email) {
                await removeBanArchive(db, 'email', normaliseEmail(p.email));
            }
        }
    }
}

module.exports.lookupBanArchive = async (db, type, value) => {
    if (type === 'email') {
        value = normaliseEmail(value.email);
    } else {
        value = value.id;
    }

    return (await db.all(SQL`SELECT * FROM bans WHERE type=${type} and value = ${value}`)).length > 0;
}
