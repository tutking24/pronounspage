import { Router } from 'express';
import SQL from 'sql-template-strings';
import {ulid} from "ulid";
import {createCanvas, loadImage, registerFont} from "canvas";
import {loadSuml} from "../loader";
import {clearKey, handleErrorAsync, isTroll} from "../../src/helpers";
import { caches } from "../../src/cache";

const translations = loadSuml('translations');

const approve = async (db, id) => {
    const { base_id } = await db.get(SQL`SELECT base_id FROM nouns WHERE id=${id}`);
    if (base_id) {
        await db.get(SQL`
            UPDATE nouns
            SET deleted=1
            WHERE id = ${base_id}
        `);
    }
    await db.get(SQL`
        UPDATE nouns
        SET approved = 1, base_id = NULL
        WHERE id = ${id}
    `);
    await caches.nouns.invalidate();
}

const addVersions = async (req, nouns) => {
    const keys = new Set();
    nouns.filter(s => !!s && s.sources)
        .forEach(s => s.sources.split(',').forEach(k => keys.add(`'` + clearKey(k.split('#')[0]) + `'`)));

    const sources = await req.db.all(SQL`
        SELECT s.*, u.username AS submitter FROM sources s
        LEFT JOIN users u ON s.submitter_id = u.id
        WHERE s.locale == ${global.config.locale}
        AND s.deleted = 0
        AND s.approved >= ${req.isGranted('sources') ? 0 : 1}
        AND s.key IN (`.append([...keys].join(',')).append(SQL`)
    `));

    const sourcesMap = {};
    sources.forEach(s => sourcesMap[s.key] = s)

    return nouns.map(n => {
        n.sourcesData = (n.sources ? n.sources.split(',') : []).map(s => selectFragment(sourcesMap, s));
        return n;
    });
};

const selectFragment = (sourcesMap, keyAndFragment) => {
    const [key, fragment] = keyAndFragment.split('#');
    if (sourcesMap[key] === undefined) {
        return undefined;
    }
    if (fragment === undefined) {
        return sourcesMap[key];
    }

    const source = {...sourcesMap[key]};

    const fragments = source.fragments
        ? source.fragments.replace('\\@', '###').split('@').map(x => x.replace('###', '\\@'))
        : [];

    source.fragments = fragments[parseInt(fragment) - 1];

    return source;
}

const router = Router();

router.get('/nouns', handleErrorAsync(async (req, res) => {
    return res.json(await caches.nouns.fetch(async () => {
        return await addVersions(req, await req.db.all(SQL`
            SELECT n.*, u.username AS author FROM nouns n
            LEFT JOIN users u ON n.author_id = u.id
            WHERE n.locale = ${global.config.locale}
            AND n.deleted = 0
            AND n.approved >= ${req.isGranted('nouns') ? 0 : 1}
            ORDER BY n.approved, n.masc
        `))
    }, !req.isGranted('nouns')));
}));

router.get('/nouns/search/:term', handleErrorAsync(async (req, res) => {
    const term = '%' + req.params.term + '%';
    return res.json(await addVersions(req, await req.db.all(SQL`
        SELECT n.*, u.username AS author FROM nouns n
        LEFT JOIN users u ON n.author_id = u.id
        WHERE n.locale = ${global.config.locale}
        AND n.approved >= ${req.isGranted('nouns') ? 0 : 1}
        AND n.deleted = 0
        AND (n.masc like ${term} OR n.fem like ${term} OR n.neutr like ${term} OR n.mascPl like ${term} OR n.femPl like ${term} OR n.neutrPl like ${term})
        ORDER BY n.approved, n.masc
    `)));
}));

router.post('/nouns/submit', handleErrorAsync(async (req, res) => {
    if (!req.user) {
        res.status(401).json({error: 'Unauthorised'});
    }

    if (!(req.user && req.user.admin) && isTroll(JSON.stringify(req.body))) {
        return res.json('ok');
    }

    const id = ulid();
    await req.db.get(SQL`
        INSERT INTO nouns (id, masc, fem, neutr, mascPl, femPl, neutrPl, sources, approved, base_id, locale, author_id)
        VALUES (
            ${id},
            ${req.body.masc.join('|')}, ${req.body.fem.join('|')}, ${req.body.neutr.join('|')},
            ${req.body.mascPl.join('|')}, ${req.body.femPl.join('|')}, ${req.body.neutrPl.join('|')},
            ${req.body.sources || null},
            0, ${req.body.base}, ${global.config.locale}, ${req.user ? req.user.id : null}
        )
    `);

    if (req.isGranted('nouns')) {
        await approve(req.db, id);
    }

    return res.json('ok');
}));

router.post('/nouns/hide/:id', handleErrorAsync(async (req, res) => {
    if (!req.isGranted('nouns')) {
        res.status(401).json({error: 'Unauthorised'});
    }

    await req.db.get(SQL`
        UPDATE nouns
        SET approved = 0
        WHERE id = ${req.params.id}
    `);

    await caches.nouns.invalidate();

    return res.json('ok');
}));

router.post('/nouns/approve/:id', handleErrorAsync(async (req, res) => {
    if (!req.isGranted('nouns')) {
        res.status(401).json({error: 'Unauthorised'});
    }

    await approve(req.db, req.params.id);

    return res.json('ok');
}));

router.post('/nouns/remove/:id', handleErrorAsync(async (req, res) => {
    if (!req.isGranted('nouns')) {
        res.status(401).json({error: 'Unauthorised'});
    }

    await req.db.get(SQL`
        UPDATE nouns
        SET deleted=1
        WHERE id = ${req.params.id}
    `);

    await caches.nouns.invalidate();

    return res.json('ok');
}));

router.get('/nouns/:id.png', async (req, res) => {
    const noun = (await req.db.get(SQL`
        SELECT * FROM nouns
        WHERE locale = ${global.config.locale}
        AND id = ${req.params.id}
        AND approved >= ${req.isGranted('nouns') ? 0 : 1}
        AND deleted = 0
    `));

    if (!noun) {
        return res.status(404).json({error: 'Not found'});
    }

    let maxItems = 0;
    ['masc', 'fem', 'neutr'].forEach((form, column) => {
        let items = 0;
        for (let [key, symbol] of [['', '⋅'], ['Pl', '⁖']]) {
            items += noun[form + key].split('|').filter(x => x.length).length;
        }
        if (items > maxItems) {
            maxItems = items;
        }
    });

    const padding = 48;
    const width = 1200;
    const height = padding * 2.5 + (maxItems + 1) * 48 + padding;
    const mime = 'image/png';

    registerFont('static/fonts/quicksand-v21-latin-ext_latin-regular.ttf', { family: 'Quicksand', weight: 'regular'});
    registerFont('static/fonts/quicksand-v21-latin-ext_latin-700.ttf', { family: 'Quicksand', weight: 'bold'});
    registerFont('node_modules/@fortawesome/fontawesome-pro/webfonts/fa-light-300.ttf', { family: 'FontAwesome', weight: 'regular'});

    const canvas = createCanvas(width, height);
    const context = canvas.getContext('2d');

    const bg = await loadImage('static/bg.png');
    context.drawImage(bg, 0, 0, width, height);

    context.font = 'bold 64pt Quicksand';

    for (let [column, key, icon] of [[0, 'masculine', '\uf222'], [1, 'feminine', '\uf221'], [2, 'neuter', '\uf22c']]) {
        context.font = 'regular 24pt FontAwesome';
        context.fillText(icon, column * (width - 2 * padding) / 3 + padding, padding * 1.5);

        context.font = 'bold 24pt Quicksand';
        context.fillText(translations.nouns[key], column * (width - 2 * padding) / 3 + padding + 36, padding * 1.5);
    }

    context.font = 'regular 24pt Quicksand';
    ['masc', 'fem', 'neutr'].forEach((form, column) => {
        let i = 0;
        for (let [key, symbol] of [['', '⋅'], ['Pl', '⁖']])
            noun[form + key].split('|').filter(x => x.length).forEach(part => {
                context.fillText(symbol + ' ' + part, column * (width - 2 * padding) / 3 + padding, padding * 2.5 + i * 48);
                i++;
            });
    })

    context.fillStyle = '#C71585';
    context.font = 'regular 16pt FontAwesome';
    context.fillText('\uf02c', padding, height - padding + 12);
    context.font = `regular 16pt Quicksand`;
    context.fillText(
        translations.title + '/' + (global.config.nouns.routeMain || global.config.nouns.route),
        padding + 36,
        height - padding + 8
    );

    return res.set('content-type', mime).send(canvas.toBuffer(mime));
});

export default router;
