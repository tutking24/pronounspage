import {renderJson} from "../src/helpers";

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

    if (req.method === 'GET' && req.url.startsWith('/all/')) {
        const locale = req.url.substring(5);
        return renderJson(res, await db.all(SQL`
            SELECT * FROM nouns
            WHERE locale = ${locale}
            AND approved >= ${isAdmin ? 0 : 1}
            ORDER BY approved, masc
        `));
    }

    if (req.method === 'POST' && req.url.startsWith('/submit/')) {
        const locale = req.url.substring(8);
        if (isAdmin || !isTroll(req.body)) {
            const id = ulid()
            await db.get(SQL`
                INSERT INTO nouns (id, masc, fem, neutr, mascPl, femPl, neutrPl, approved, base_id, locale)
                VALUES (
                    ${id},
                    ${req.body.masc.join('|')}, ${req.body.fem.join('|')}, ${req.body.neutr.join('|')},
                    ${req.body.mascPl.join('|')}, ${req.body.femPl.join('|')}, ${req.body.neutrPl.join('|')},
                    0, ${req.body.base}, ${locale}
                )
            `);
            if (isAdmin) {
                await approve(db, id);
            }
        }
        return renderJson(res, 'ok');
    }

    if (req.method === 'POST' && req.url.startsWith('/approve/') && isAdmin) {
        await approve(db, getId(req.url));
        return renderJson(res, 'ok');
    }

    if (req.method === 'POST' && req.url.startsWith('/hide/') && isAdmin) {
        await hide(db, getId(req.url));
        return renderJson(res, 'ok');
    }

    if (req.method === 'POST' && req.url.startsWith('/remove/') && isAdmin) {
        await remove(db, getId(req.url));
        return renderJson(res, 'ok');
    }

    return renderJson(res, {error: 'Not found'}, 404);
}
