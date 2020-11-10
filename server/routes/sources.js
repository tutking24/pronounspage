import { Router } from 'express';
import mailer from "../../src/mailer";
import { camelCase } from "../../src/helpers";
import { loadTsv } from '../loader';

const generateId = title => {
    return camelCase(title.split(' ').slice(0, 2));
}

const buildEmail = (data, user) => {
    const human = [
        `<li><strong>user:</strong> ${user ? user.username : ''}</li>`,
        `<li><strong>pronouns:</strong> ${data.pronouns}</li>`,
    ];
    const tsv = [generateId(data.title) || '???'];

    for (let field of ['type','author','title','extra','year','fragments','comment','link']) {
        human.push(`<li><strong>${field}:</strong> ${field === 'fragments' ? `<pre>${data[field]}</pre>`: data[field]}</li>`);
        tsv.push(field === 'fragments' ? (data[field].join('@').replace(/\n/g, '|')) : data[field]);
    }

    return `<ul>${human.join('')}</ul><pre>${tsv.join('\t')}</pre>`;
}

const loadSources = () => {
    return loadTsv('sources/sources').map(s => {
        if (s.author) {
            s.author = s.author.replace('^', '');
        }
        s.fragments = s.fragments.split('@').map(f => f.replace(/\|/g, '\n'));
        return s;
    });
}

const router = Router();

router.get('/sources', async (req, res) => {
    return res.json(loadSources());
});

router.get('/sources/:key', async (req, res) => {
    return res.json([...loadSources().filter(s => s.key === req.params.key), null][0]);
});

router.post('/sources/submit', async (req, res) => {
    const emailBody = buildEmail(req.body, req.user);

    for (let admin of process.env.MAILER_ADMINS.split(',')) {
        mailer(admin, `[Pronouns][${req.config.locale}] Source submission`, undefined, emailBody);
    }

    return res.json({ result: 'ok' });
});

export default router;
