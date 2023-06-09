const nodemailer = require('nodemailer');
const fs = require('fs');
const Suml = require('suml');
const forbidden = require('./forbidden');

const color = '#C71585';
const logo = fs.readFileSync(__dirname + '/../static/logo/logo-primary.svg').toString('utf-8');
const logoEncoded = 'data:image/svg+xml,' + encodeURIComponent(logo);

const loadSuml = name => new Suml().parse(fs.readFileSync(`${__dirname}/../data/${name}.suml`).toString());
const translations = loadSuml('translations');
const fallbackTranslations = loadSuml('../_base/translations');

const transporter = nodemailer.createTransport(process.env.MAILER_TRANSPORT, {from: process.env.MAILER_FROM});

const sendEmail = (to, subject, text = undefined, html = undefined) => {
    transporter.sendMail({
        to,
        subject,
        text,
        html,
    }, function(err) { if (err) { console.error(err); } })
};

const findTranslation = (key) => {
    return _findTranslation(translations, key) || _findTranslation(fallbackTranslations, key)
}

const _findTranslation = (translations, key) => {
    let x = translations;
    for (let part of key.split('.')) {
        x = x[part];
        if (x === undefined) {
            return undefined;
        }
    }
    return x;
}

const violations = findTranslation('terms.content.content.violationsExamples');
delete violations['miscellaneous'];
const terms = findTranslation('terms.content.content.violations') + ' ' +  Object.values(violations).join(', ');


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
            <p style="font-size: 14px;">[[ban.appealEmail]]</p>
            <p style="color: #999; font-size: 10px;">@{{username}}</p>
        `,
    },
    inactivityWarning: {
        subject: '[[user.removeInactive.email.subject]]',
        text: '[[user.removeInactive.email.content]]',
        html: `
            <p>[[user.removeInactive.email.content]]</p>
            <p>[[user.removeInactive.email.clarification]] @{{username}}</p>
            <p style="text-align: center; padding-top: 16px; padding-bottom: 16px;">
                <a href="https://en.pronouns.page/account" target="_blank" rel="noopener" style="background-color: #C71585; color: #fff; padding: 8px 16px; border: none; border-radius: 6px;text-decoration: none">
                    [[user.removeInactive.email.cta]]
                </a>
            </p>
            <p style="color: #999; font-size: 10px;">@{{username}}</p>
        `,
    },
    cardsWarning: {
        subject: 'Cards queue is getting long',
        text: 'There\'s {{count}} cards in the queue!',
        html: '<p>There\'s {{count}} cards in the queue!</p>',
    },
    linksWarning: {
        subject: 'Links queue is getting long',
        text: 'There\'s {{count}} links in the queue!',
        html: '<p>There\'s {{count}} links in the queue!</p>',
    },
    translationProposed: {
        subject: '[{{locale}}] New translations proposed',
        text: 'Check them out here: https://[[domain]]/admin',
        html: '<p>Check them out here: <a href="https://[[domain]]/admin/translations/awaiting" target="_blank" rel="noopener">[[domain]]/admin/translations/awaiting</a></p>',
    },
    translationToMerge: {
        subject: '[{{locale}}] New translations ready to be merged',
        text: 'Check them out here: https://[[domain]]/admin',
        html: '<p>Check them out here: <a href="https://[[domain]]/admin/translations/awaiting" target="_blank" rel="noopener">[[domain]]/admin/translations/awaiting</a></p>',
    },
    modMessage: {
        subject: '[[user.modMessage.subject]]',
        text: `[[user.modMessage.intro]]\n\n{{nl2br:message}}\n\n[[user.modMessage.respond]]`,
        html: `
            <p>[[user.modMessage.intro]]</p>
            <p style="color: #222; padding-left: 1em;padding-right: 1em;font-style: italic;">{{nl2br:message}}</p>
            <p>[[user.modMessage.respond]]</p>
            <p style="color: #999; font-size: 10px;">@{{modUsername}} → @{{username}}</p>
        `,
    },
    sensitiveApplied: {
        subject: '[[profile.sensitive.email.subject]]',
        text: `[[profile.sensitive.email.content]]\n\n{{warnings}}`,
        html: `
            <p>[[profile.sensitive.email.content]] <strong>{{warnings}}</strong></p>
            <p style="color: #999; font-size: 10px;">@{{modUsername}} → @{{username}}</p>
        `,
    },
}

const applyTemplate = (template, context, params) => {
    if (typeof(template) === 'string') {
        template = templates[template];
    }
    template = template[context];

    if (templates.base[context] !== undefined) {
        template = templates.base[context].replace('{{content}}', template);
    }

    template = template.replace(/%reason%/g, '{{reason}}'); // TODO

    template = template.replace(/\[\[([^\]]+)]]/g, m => {
        return findTranslation(m.substring(2, m.length - 2));
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
        if (key.startsWith('nl2br:')) {
            const value = params[key.substring(6)];
            return context === 'html'
                ? value.replace(new RegExp('\\n', 'g'), '<br/>')
                : value;
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
