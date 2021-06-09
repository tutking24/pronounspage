import express from 'express';
import authenticate from '../src/authenticate';
import dbConnection from './db';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import grant from "grant";
import router from "./routes/user";
import { loadSuml } from './loader';
import {buildLocaleList, isGranted} from "../src/helpers";

global.config = loadSuml('config');

const app = express()
app.enable('trust proxy')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: process.env.SECRET,
    cookie: {},
    resave: false,
    saveUninitialized: false,
}));

app.use(async function (req, res, next) {
    req.config = global.config;
    req.locales = buildLocaleList(global.config.locale);
    req.rawUser = authenticate(req);
    req.user = req.rawUser && req.rawUser.authenticated ? req.rawUser : null;
    req.isGranted = (area, locale = global.config.locale) => req.user && isGranted(req.user, locale, area);
    req.db = await dbConnection();
    res.on('finish', async () => {
        await req.db.close();
    });
    next();
});

router.use(grant.express()(require('./social').config));

app.use(require('./routes/banner').default);

app.use(require('./routes/user').default);
app.use(require('./routes/profile').default);
app.use(require('./routes/admin').default);

app.use(require('./routes/pronouns').default);
app.use(require('./routes/sources').default);
app.use(require('./routes/nouns').default);
app.use(require('./routes/inclusive').default);
app.use(require('./routes/terms').default);
app.use(require('./routes/pronounce').default);
app.use(require('./routes/census').default);

app.use(require('./routes/images').default);

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Unexpected server error');
});

export default {
    path: '/api',
    handler: app,
}
