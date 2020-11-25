import { Router } from 'express';
import SQL from 'sql-template-strings';
import {ulid} from "ulid";
import {createCanvas, loadImage, registerFont} from "canvas";
import {loadSuml} from "../loader";

const translations = loadSuml('translations');

const isTroll = (body) => {
    return ['cipeusz', 'feminazi', 'bruksela', 'zboczeń'].some(t => body.indexOf(t) > -1);
}

const approve = async (db, id) => {
    const { base_id } = await db.get(SQL`SELECT base_id FROM nouns WHERE id=${id}`);
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

const router = Router();

router.get('/nouns', async (req, res) => {
    return res.json(await req.db.all(SQL`
        SELECT * FROM nouns
        WHERE locale = ${req.config.locale}
        AND approved >= ${req.admin ? 0 : 1}
        ORDER BY approved, masc
    `));
});

router.get('/nouns/search/:term', async (req, res) => {
    const term = '%' + req.params.term + '%';
    return res.json(await req.db.all(SQL`
        SELECT * FROM nouns
        WHERE locale = ${req.config.locale}
        AND approved >= ${req.admin ? 0 : 1}
        AND (masc like ${term} OR fem like ${term} OR neutr like ${term} OR mascPl like ${term} OR femPl like ${term} OR neutrPl like ${term})
        ORDER BY approved, masc
    `));
});

router.post('/nouns/submit', async (req, res) => {
    if (!(req.user && req.user.admin) && isTroll(JSON.stringify(req.body))) {
        return res.json('ok');
    }

    const id = ulid();
    await req.db.get(SQL`
        INSERT INTO nouns (id, masc, fem, neutr, mascPl, femPl, neutrPl, approved, base_id, locale)
        VALUES (
            ${id},
            ${req.body.masc.join('|')}, ${req.body.fem.join('|')}, ${req.body.neutr.join('|')},
            ${req.body.mascPl.join('|')}, ${req.body.femPl.join('|')}, ${req.body.neutrPl.join('|')},
            0, ${req.body.base}, ${req.config.locale}
        )
    `);

    if (req.admin) {
        await approve(req.db, id);
    }

    return res.json('ok');
});

router.post('/nouns/hide/:id', async (req, res) => {
    if (!req.admin) {
        res.status(401).json({error: 'Unauthorised'});
    }

    await req.db.get(SQL`
        UPDATE nouns
        SET approved = 0
        WHERE id = ${req.params.id}
    `);

    return res.json('ok');
});

router.post('/nouns/approve/:id', async (req, res) => {
    if (!req.admin) {
        res.status(401).json({error: 'Unauthorised'});
    }

    await approve(req.db, req.params.id);

    return res.json('ok');
});

router.post('/nouns/remove/:id', async (req, res) => {
    if (!req.admin) {
        res.status(401).json({error: 'Unauthorised'});
    }

    await req.db.get(SQL`
        DELETE FROM nouns
        WHERE id = ${req.params.id}
    `);

    return res.json('ok');
});

const findBaseForm = (noun, query) => {
    for (let form of ['masc', 'fem', 'neutr', 'mascPl', 'femPl', 'neutrPl']) {
        for (let formPart of noun[form].split('|')) {
            if (formPart.toLowerCase() === query.toLowerCase()) {
                return formPart;
            }
        }
    }

    return null;
}

router.get('/nouns/:word.png', async (req, res) => {
    const query = req.params.word.toLowerCase();
    const term = '%' + query + '%';
    const noun = (await req.db.all(SQL`
        SELECT * FROM nouns
        WHERE locale = ${req.config.locale}
        AND approved >= ${req.admin ? 0 : 1}
        AND (masc like ${term} OR fem like ${term} OR neutr like ${term} OR mascPl like ${term} OR femPl like ${term} OR neutrPl like ${term})
        ORDER BY masc
    `)).filter(noun =>
        noun.masc.toLowerCase().split('|').includes(query)
        || noun.fem.toLowerCase().split('|').includes(query)
        || noun.neutr.toLowerCase().split('|').includes(query)
        || noun.mascPl.toLowerCase().split('|').includes(query)
        || noun.femPl.toLowerCase().split('|').includes(query)
        || noun.neutrPl.toLowerCase().split('|').includes(query)
    )[0]

    if (!noun) {
        return res.status(404).json({error: 'Not found'});
    }

    const base = findBaseForm(noun, query);

    const width = 1200;
    const height = 600;
    const padding = 48;
    const mime = 'image/png';

    registerFont('static/fonts/quicksand-v21-latin-ext_latin-regular.ttf', { family: 'Quicksand', weight: 'regular'});
    registerFont('static/fonts/quicksand-v21-latin-ext_latin-700.ttf', { family: 'Quicksand', weight: 'bold'});
    registerFont('node_modules/@fortawesome/fontawesome-pro/webfonts/fa-light-300.ttf', { family: 'FontAwesome', weight: 'regular'});

    const canvas = createCanvas(width, height);
    const context = canvas.getContext('2d');

    context.fillStyle = '#fff';
    context.fillRect(0, 0, width, height);
    context.fillStyle = '#000';

    context.font = 'bold 64pt Quicksand';
    context.fillText(base, width / 2 - context.measureText(base).width / 2, 120);

    for (let [column, key, icon] of [[0, 'masculine', '\uf222'], [1, 'feminine', '\uf221'], [2, 'neuter', '\uf22c']]) {
        context.font = 'regular 24pt FontAwesome';
        context.fillText(icon, column * (width - 2 * padding) / 3 + padding, 192);

        context.font = 'bold 24pt Quicksand';
        context.fillText(translations.nouns[key], column * (width - 2 * padding) / 3 + padding + 36, 192);
    }

    context.font = 'regular 24pt Quicksand';
    ['masc', 'fem', 'neutr'].forEach((form, column) => {
        let i = 0;
        for (let [key, symbol] of [['', '⋅'], ['Pl', '⁖']])
        noun[form + key].split('|').filter(x => x.length).forEach(part => {
            context.fillText(symbol + ' ' + part, column * (width - 2 * padding) / 3 + padding, 244 + i * 48);
            i++;
        });
    })

    context.fillStyle = '#C71585';
    context.font = 'regular 24pt FontAwesome';
    context.fillText('\uf02c', padding, height - padding);
    context.font = `regular 24pt Quicksand`;
    context.fillText(translations.title, padding + 48, height - padding);

    return res.set('content-type', mime).send(canvas.toBuffer(mime));
});

export default router;
