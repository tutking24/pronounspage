const sqlite = require('sqlite');
const sqlite3 = require('sqlite3');
const SQL = require('sql-template-strings');
import { ulid } from 'ulid'

const parseQuery = (queryString) => {
    const query = {};
    const pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
    for (let i = 0; i < pairs.length; i++) {
        let pair = pairs[i].split('=');
        query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
    }
    return query;
}

const getId = url => url.match(/\/([^/]+)$/)[1];

const approve = async (db, id) => {
    const {base_id} = await db.get(SQL`SELECT base_id FROM nouns WHERE id=${id}`);
    if (base_id) {
        await db.get(SQL`
            DELETE FROM nouns
            WHERE id = ${base_id}
        `);
    }
    await db.get(SQL`
        UPDATE nouns
        SET approved = 1, base_id = NULL
        WHERE id = ${id}
    `);
}

const hide = async (db, id) => {
    await db.get(SQL`
        UPDATE nouns
        SET approved = 0
        WHERE id = ${id}
    `);
}

const remove = async (db, id) => {
    await db.get(SQL`
        DELETE FROM nouns
        WHERE id = ${id}
    `);
}

export default async function (req, res, next) {
    const db = await sqlite.open({
        filename: __dirname + '/../data/db.sqlite',
        driver: sqlite3.Database,
    });

    const [url, queryString] = req.url.split('?');
    const query = parseQuery(queryString || '');

    const isAdmin = query['secret'] === process.env.SECRET;

    let result = {error: 'Not found'}
    if (req.method === 'GET' && url === '/all') {
        result = await db.all(`
            SELECT * FROM nouns
            ${isAdmin ? '' : 'WHERE approved = 1'}
            ORDER BY approved, masc
        `);
    } else if (req.method === 'POST' && url === '/submit') {
        const id = ulid()
        await db.get(SQL`
            INSERT INTO nouns (id, masc, fem, neutr, mascPl, femPl, neutrPl, approved, base_id)
            VALUES (
                ${id},
                ${req.body.data.masc.join('|')}, ${req.body.data.fem.join('|')}, ${req.body.data.neutr.join('|')},
                ${req.body.data.mascPl.join('|')}, ${req.body.data.femPl.join('|')}, ${req.body.data.neutrPl.join('|')},
                0, ${req.body.data.base}
            )
        `);
        if (isAdmin) {
            await approve(db, id);
        }
        result = 'ok';
    } else if (req.method === 'POST' && url.startsWith('/approve/') && isAdmin) {
        await approve(db, getId(url));
        result = 'ok';
    } else if (req.method === 'POST' && url.startsWith('/hide/') && isAdmin) {
        await hide(db, getId(url));
        result = 'ok';
    } else if (req.method === 'POST' && url.startsWith('/remove/') && isAdmin) {
        await remove(db, getId(url));
        result = 'ok';
    }

    res.setHeader('content-type', 'application/json');
    res.write(JSON.stringify(result));
    res.end()
}
