const mailer = require('mailer');
const fs = require('fs');
const Suml = require('suml');
const forbidden = require('./forbidden');

const color = '#C71585';
const logo = fs.readFileSync(__dirname + '/../node_modules/@fortawesome/fontawesome-pro/svgs/light/tags.svg').toString('utf-8');
const logoEncoded = 'data:image/svg+xml,' + encodeURIComponent(logo.replace('<path ', `<path fill="${color}" `));

const loadSuml = name => new Suml().parse(fs.readFileSync(`${__dirname}/../data/${name}.suml`).toString());
const translations = loadSuml('translations');

const sendEmail = (to, subject, body = undefined, html = undefined) => {
    mailer.send({
            host: process.env.MAILER_HOST,
            port: parseInt(process.env.MAILER_PORT),
            ssl: parseInt(process.env.MAILER_PORT) === 465,
            authentication: 'login',
            username: process.env.MAILER_USER,
            password: process.env.MAILER_PASS,
            from: process.env.MAILER_FROM,
            to,
            subject,
            body,
            html,
        },
        function(err){
            if (err) {
                console.error(err);
            }
        });
};

const terms = translations.terms && translations.terms.content ? (translations.terms.content.content.violations + ' ' + Object.values(translations.terms.content.content.violationsExamples).join(', ')) : '';

const templates = {
    base: {
        subject: `[[title]] » {{content}}`,
        html: `
            <div style="margin: 36px auto; width: 100%; max-width: 480px; border: 1px solid #aaa;border-radius: 8px;overflow: hidden;font-family: Nunito, Quicksand, Helvetica, sans-serif;font-size: 16px;box-shadow: 0 .5rem 1rem rgba(0, 0, 0, .15)">
                <div style="padding: 16px; padding-top: 10px; background: #f8f8f8; border-bottom: 1px solid #aaa;font-size: 20px;color: ${color};">
                    <img src="${logoEncoded}" style="height: 24px;width: 24px; position: relative; top: 6px; margin-right: 6px;" alt="Logo"/>
                    [[title]]
                </div>
                <div style="padding: 8px 16px; background: #fff;">
                    {{content}}
                </div>
            </div>
        `,
    },
    notify: {
        subject: 'There are entries awaiting moderation',
        text: 'Entries awaiting moderation:\n\n{{list:stats}}',
        html: `
            <p>Entries awaiting moderation</p>
            <ul>{{list:stats}}</ul>
        `,
    },
    confirmCode: {
        subject: '[[user.login.email.subject]]',
        text: `[[user.login.email.instruction]]\n\n{{code}}\n\n[[user.login.email.extra]]`,
        html: `
            <p>[[user.login.email.instruction]]</p>
            <p style="border: 1px solid #aaa;border-radius: 8px;overflow: hidden;text-align: center;user-select: all;font-size: 24px; padding:8px;letter-spacing: 8px; font-weight: bold;">{{code}}</p>
            <p style="font-size: 12px; color: #777">[[user.login.email.extra]]</p>
        `,
    },
    ban: {
        subject: '[[ban.header]]',
        text: `[[ban.header]]\n\n[[ban.reason]][[quotation.colon]] %reason%\n\n[[quotation.start]]${terms}[[quotation.end]]`,
        html: `
            <p>[[ban.header]]</p>
            <p>[[ban.reason]][[quotation.colon]] %reason%</p>
            <p style="font-size: 12px; color: #777">[[quotation.start]]${terms}[[quotation.end]]</p>
        `,
    },
}

const applyTemplate = (template, context, params) => {
    template = templates[template][context];

    if (templates.base[context] !== undefined) {
        template = templates.base[context].replace('{{content}}', template);
    }

    template = template.replace(/%reason%/g, '{{reason}}'); // TODO

    template = template.replace(/\[\[([^\]]+)]]/g, m => {
        let x = translations;
        for (let part of m.substring(2, m.length - 2).split('.')) {
            x = x[part];
        }
        return x;
    });

    template = template.replace(/{{([^}]+)}}/g, m => {
        const key = m.substring(2, m.length - 2);
        if (key.startsWith('list:')) {
            const value = params[key.substring(5)];
            if (Array.isArray(value)) {
                return context === 'html'
                    ? value.map(s => `<li>${s}</li>`).join('')
                    : value.map(s => ` - ${s}`).join('\n');
            } else {
                return context === 'html'
                    ? Object.keys(value).map(s => `<li><strong>${s}:</strong> ${value[s]}</li>`).join('')
                    : Object.keys(value).map(s => ` - ${s}: ${value[s]}`).join('\n');
            }
        }
        return params[key];
    });

    return template;
}

module.exports = (to, template, params = {}) => {
    sendEmail(
        process.env.MAILER_OVERWRITE || to,
        applyTemplate(template, 'subject', params),
        applyTemplate(template, 'text', params),
        applyTemplate(template, 'html', params),
    );
};
