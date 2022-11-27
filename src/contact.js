import translator from './translator';

export const contact = {
    all: {
        email: {
            icon: 'envelope',
            url: 'mailto:contact@pronouns.page',
            headline: 'contact@pronouns.page',
        },
    },
    polish: {
        email: {
            icon: 'envelope',
            url: 'mailto:kontakt@zaimki.pl',
            headline: 'kontakt@zaimki.pl',
        },
    }
}

export const socialLinks = {
    all: {
        mastodon: {
            icon: 'mastodon',
            iconSet: 'b',
            url: 'https://tech.lgbt/@PronounsPage',
            headline: '@PronounsPage@tech.lgbt',
        },
        twitter: {
            icon: 'twitter',
            iconSet: 'b',
            url: 'https://twitter.com/PronounsPage',
            headline: '@PronounsPage',
        },
    },

    polish: {
        mastodon: {
            icon: 'mastodon',
            iconSet: 'b',
            url: 'https://kolektiva.social/@neutratywy',
            headline: '@neutratywy@kolektiva.social',
        },
        twitter: {
            icon: 'twitter',
            iconSet: 'b',
            url: 'https://twitter.com/neutratywy',
            headline: '@neutratywy',
        },
        instagram: {
            icon: 'instagram',
            iconSet: 'b',
            url: 'https://instagram.com/neutratywy',
            headline: '@neutratywy',
        },
        facebook: {
            icon: 'facebook',
            iconSet: 'b',
            url: 'https://facebook.com/neutratywy',
            headline: 'fb.com/neutratywy',
        },
    },

    calendar: {
        mastodon: {
            icon: 'mastodon',
            iconSet: 'b',
            url: 'https://tech.lgbt/@QueerCalendar',
            headline: '@QueerCalendar@tech.lgbt',
        },
        twitter: {
            icon: 'twitter',
            iconSet: 'b',
            url: 'https://twitter.com/CalendarQueer',
            headline: '@CalendarQueer',
        },
    },
}

export const COLOURS = {
    mastodon: '#3188d4',
    facebook: '#1877F2',
    linkedin: '#2867B2',
    messenger: '#0099FF',
    odnoklassniki: '#EE8208',
    pinterest: '#e60023',
    pocket: '#EF4154',
    reddit: '#ff4500',
    telegram: '#179CDE',
    twitter: '#1da1f2',
    viber: '#7360f2',
    vkontakte: '#4680C2',
    whatsapp: '#25D366',

    instagram: '#d52a76',
    email: '#18b089',
    faq: '#C71585',
}

const AVATARS = {
    'all': 'pronounspage.png',
    'polish': 'neutratywy.png',
    'calendar': 'calendarqueer.png',
}

const supportLinks = {
    all: {
        bank: {
            icon: 'money-check-alt',
            url: 'https://bunq.me/PronounsPage',
            headline: translator.translate('support.bankAccount'),
            // tooltip: translator.translate('support.bankAccountOwner'),
        },
        kofi: {
            icon: 'coffee',
            url: 'https://ko-fi.com/radajezykaneutralnego',
            headline: 'Ko-Fi',
        },
        paypal: {
            icon: 'paypal',
            iconSet: 'b',
            url: 'https://paypal.me/RJNeutralnego',
            headline: 'PayPal',
        },
    }
}

function* getLink(links, group) {
    const featureLinks = links[group] || {};
    for (let key in featureLinks) {
        if (!featureLinks.hasOwnProperty(key)) { continue; }
        let avatar = AVATARS[group];
        if (featureLinks[key].url.startsWith('mailto:')) {
            avatar = null;
        }
        yield {
            ...featureLinks[key],
            group,
            avatar,
            colour: COLOURS[key] || '#cc3aa3',
        };
    }
}

export function* getContactLinks(config) {
    if (config.faq.enabled) {
        yield {
            url: `/${config.faq.route}`,
            icon: 'map-marker-question',
            headline: translator.translate('faq.headerLong'),
            group: 'all',
            colour: COLOURS['faq'],
        }
    }
    yield* getLink(contact, 'all');
    if (config.locale === 'pl') {
        yield* getLink(contact, 'polish');
    }
}

export function* getSocialLinks(config) {
    yield* getLink(socialLinks, 'all');
    if (config.locale === 'pl') {
        yield* getLink(socialLinks, 'polish');
    }
    if (config.calendar && config.calendar.enabled) {
        yield* getLink(socialLinks, 'calendar');
    }
}

export function* getSupportLinks(config) {
    yield* getLink(supportLinks, 'all');
}
