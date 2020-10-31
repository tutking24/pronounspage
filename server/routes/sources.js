import { Router } from 'express';
import mailer from "../../src/mailer";

const buildEmail = (data, user) => {
    const human = [
        `<li><strong>user:</strong> ${user ? user.username : ''}</li>`,
        `<li><strong>templates:</strong> ${data.templates}</li>`,
    ];
    const tsv = ['???'];

    for (let field of ['type','author','title','extra','year','fragments','comment','link']) {
        human.push(`<li><strong>${field}:</strong> ${field === 'fragments' ? `<pre>${data[field]}</pre>`: data[field]}</li>`);
        tsv.push(field === 'fragments' ? (data[field].join('@').replace(/\n/g, '|')) : data[field]);
    }

    return `<ul>${human.join('')}</ul><pre>${tsv.join('\t')}</pre>`;
}

const router = Router();

router.post('/sources/submit/:locale', async (req, res) => {
    const emailBody = buildEmail(req.body, req.user);

    for (let admin of process.env.MAILER_ADMINS.split(',')) {
        mailer(admin, `[Pronouns][${req.params.locale}] Source submission`, undefined, emailBody);
    }

    return res.json({ result: 'ok' });
});

export default router;
