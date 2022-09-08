import * as sqlite from 'sqlite';
import * as sqlite3 from 'sqlite3';

export type SQLQuery = sqlite.ISqlite.SqlType;
export type Database = sqlite.Database;
export default () => sqlite.open({
    filename: __dirname + '/../db.sqlite',
    driver: sqlite3.Database,
});
