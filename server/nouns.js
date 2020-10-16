const dbConnection = require('./db');
const SQL = require('sql-template-strings');
import { ulid } from 'ulid'
import authenticate from './authenticate';



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

const trollWords = [
    'cipeusz',
    'feminazi',
    'bruksela',
    'zboczeń',
];

const isTroll = (body) => {
    const jsonBody = JSON.stringify(body);
    for (let trollWord of trollWords) {
        if (jsonBody.indexOf(trollWord) > -1) {
            return true;
        }
    }

    return false;
}

export default async function (req, res, next) {
    const db = await dbConnection();
    const user = authenticate(req);
    const isAdmin = user && user.authenticated && user.roles === 'admin';

    let result = {error: 'Not found'}
    if (req.method === 'GET' && req.url === '/all') {
        result = await db.all(`
            SELECT * FROM nouns
            ${isAdmin ? '' : 'WHERE approved = 1'}
            ORDER BY approved, masc
        `);
    } else if (req.method === 'POST' && req.url === '/submit') {
        if (isAdmin || !isTroll(req.body.data)) {
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
        }
        result = 'ok';
    } else if (req.method === 'POST' && req.url.startsWith('/approve/') && isAdmin) {
        await approve(db, getId(req.url));
        result = 'ok';
    } else if (req.method === 'POST' && req.url.startsWith('/hide/') && isAdmin) {
        await hide(db, getId(req.url));
        result = 'ok';
    } else if (req.method === 'POST' && req.url.startsWith('/remove/') && isAdmin) {
        await remove(db, getId(req.url));
        result = 'ok';
    }

    res.setHeader('content-type', 'application/json');
    res.write(JSON.stringify(result));
    res.end()
}
