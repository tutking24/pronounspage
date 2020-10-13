import jwt from './jwt';
import { makeId } from '../src/helpers';

export default async function (req, res, next) {
    const db = await dbConnection();

    let result = {error: 'Not found'}
    if (req.method === 'GET' && req.url === '/all') {
        jwt.sign({
            username: 'andrea',
            email: 'andrea@avris.it',
            secret: makeId(6, '0123456789'),
        })
    }

    res.setHeader('content-type', 'application/json');
    res.write(JSON.stringify(result));
    res.end();
}
