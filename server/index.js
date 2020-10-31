import express from 'express';
import authenticate from '../src/authenticate';
import dbConnection from './db';

const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(async function (req, res, next) {
    req.rawUser = authenticate(req);
    req.user = req.rawUser && req.rawUser.authenticated ? req.rawUser : null;
    req.admin = req.user && req.user.roles === 'admin';
    req.db = await dbConnection();
    next();
})

app.use(require('./routes/banner').default);

app.use(require('./routes/user').default);
app.use(require('./routes/profile').default);
app.use(require('./routes/admin').default);

app.use(require('./routes/nouns').default);
app.use(require('./routes/sources').default);

export default {
    path: '/api',
    handler: app,
}
