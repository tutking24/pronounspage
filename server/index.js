import express from 'express';
import authenticate from '../src/authenticate';
import dbConnection from './db';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import grant from "grant";
import router from "./routes/user";
import { loadSuml } from './loader';
import {isGranted} from "../src/helpers";
import buildLocaleList from "../src/buildLocaleList";
import cookieSettings from "../src/cookieSettings";
import SQL from "sql-template-strings";

global.config = loadSuml('config');
global.translations = loadSuml('translations');

const app = express()
app.enable('trust proxy')

app.use(express.json({
    verify: (req, res, buf) => {
        if (buf.includes(Buffer.from('narodowcy.net', 'utf-8'))) {
            req.socket.end();
            throw 'fuck off';
        }
    }
}));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: process.env.SECRET,
    cookie: cookieSettings,
    resave: false,
    saveUninitialized: false,
}));

class LazyDatabase {
    constructor() {
        this.db = null;
    }

    async init() {
        if (this.db === null) {
            this.db = await dbConnection();
            // await this.db.get('PRAGMA journal_mode = WAL;');
            await this.db.get('PRAGMA busy_timeout = 5000;');
            // await this.db.get('PRAGMA foreign_keys = ON;')
        }
    }

    async get(...args) {
        await this.init();
        return this.db.get(...args)
    }

    async all(...args) {
        await this.init();
        return this.db.all(...args);
    }

    async close() {
        if (this.db !== null) {
            try {
                await this.db.close();
            } catch {}
        }
    }
}

app.use(async function (req, res, next) {
    try {
        req.rawUser = authenticate(req);
        req.user = req.rawUser && req.rawUser.authenticated ? req.rawUser : null;
        req.isGranted = (area = '', locale = global.config.locale) => req.user && isGranted(req.user, locale, area);
        req.locales = buildLocaleList(global.config.locale, global.config.locale === '_');
        req.db = new LazyDatabase();
        req.isUserAllowedToPost = async () => {
            const user = await req.db.get(SQL`SELECT bannedReason FROM users WHERE id = ${req.user.id}`);
            return user && !user.bannedReason;
        }
        res.on('finish', async () => {
            await req.db.close();
        });
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Headers', 'authorization,content-type');
        next();
    } catch (err) {
        next(err);
    }
});

app.use(require('./routes/grantOverrides').default);
router.use(grant.express()(require('./social').config));

app.use(require('./routes/home').default);
app.use(require('./routes/banner').default);
app.use(require('./routes/user').default);
app.use(require('./routes/profile').default);
app.use(require('./routes/admin').default);
app.use(require('./routes/mfa').default);
app.use(require('./routes/pronouns').default);
app.use(require('./routes/sources').default);
app.use(require('./routes/nouns').default);
app.use(require('./routes/inclusive').default);
app.use(require('./routes/terms').default);
app.use(require('./routes/pronounce').default);
app.use(require('./routes/census').default);
app.use(require('./routes/names').default);
app.use(require('./routes/images').default);
app.use(require('./routes/blog').default);
app.use(require('./routes/calendar').default);
app.use(require('./routes/translations').default);
app.use(require('./routes/subscription').default);

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Unexpected server error');
    req.db.close();
});

export default {
    path: '/api',
    handler: app,
}
