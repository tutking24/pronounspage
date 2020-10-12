const sqlite = require('sqlite');
const sqlite3 = require('sqlite3');

module.exports = _ => sqlite.open({
    filename: __dirname + '/../db.sqlite',
    driver: sqlite3.Database,
});
