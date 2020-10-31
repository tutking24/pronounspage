const dbConnection = require('./db');
import {renderJson} from "../src/helpers";
import authenticate from './authenticate';
const mailer = require('./mailer');


const buildEmail = (data, user) => {
    const human = [
        `<li><strong>user:</strong> ${user ? user.username : ''}</li>`,
        `<li><strong>templates:</strong> ${data.templates}</li>`,
    ];
    const tsv = ['???'];

    for (let field of ['type','author','title','extra','year','fragments','comment','link']) {
        human.push(`<li><strong>${field}:</strong> ${data[field]}</li>`);
        tsv.push(data[field]);
    }

    return `<ul>${human.join('')}</ul><pre>${tsv.join('\t')}</pre>`;
}

export default async function (req, res, next) {
    const db = await dbConnection();
    const user = authenticate(req);

    if (req.method === 'POST' && req.url.startsWith('/submit/')) {
        const locale = req.url.substring(8);

        const emailBody = buildEmail(req.body, user);

        for (let admin of process.env.MAILER_ADMINS.split(',')) {
            mailer(admin, `[Pronouns][${locale}] Source submission`, undefined, emailBody);
        }
        return renderJson(res, { result: 'ok' });
    }

    return renderJson(res, { error: 'notfound' }, 404);
}
