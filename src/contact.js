export const contact = {
    all: {
        email_pl: {
            icon: 'envelope',
            url: 'mailto:kontakt@zaimki.pl',
            headline: 'kontakt@zaimki.pl',
        },
        email: {
            icon: 'envelope',
            url: 'mailto:contact@pronouns.page',
            headline: 'contact@pronouns.page',
        },
    },
}

export const socialLinks = {
    all: {
        twitter_pl: {
            icon: 'twitter',
            iconSet: 'b',
            url: 'https://twitter.com/neutratywy',
            headline: '@neutratywy',
        },
        instagram_pl: {
            icon: 'instagram',
            iconSet: 'b',
            url: 'https://instagram.com/neutratywy',
            headline: '@neutratywy',
        },
        facebook_pl: {
            icon: 'facebook',
            iconSet: 'b',
            url: 'https://facebook.com/neutratywy',
            headline: 'fb.com/neutratywy',
        },

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

const supportLinks = {
    all: {
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

function* getLink(links, feature, locale) {
    const featureLinks = links[feature] || {};
    for (let key in featureLinks) {
        if (!featureLinks.hasOwnProperty(key)) { continue; }
        let [, localesAllowed] = key.split('_');
        if (localesAllowed === undefined || locale === '_' || localesAllowed.split(',').includes(locale)) {
            yield featureLinks[key];
        }
    }
}

export function* getContactLinks(config) {
    yield* getLink(contact, 'all', config.locale);
}

export function* getSocialLinks(config) {
    yield* getLink(socialLinks, 'all', config.locale);
    if (config.calendar && config.calendar.enabled) {
        yield* getLink(socialLinks, 'calendar', config.locale);
    }
}

export function* getSupportLinks(config) {
    yield* getLink(supportLinks, 'all', config.locale);
}
