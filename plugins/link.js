import {clearUrl} from "../src/helpers";

const LINK_PROVIDERS = {
    twitter: {
        regex: '^https?://(?:www.)?twitter.com/([^/]+)',
        icon: 'twitter',
        iconSet: 'b',
    },
    facebook: {
        regex: '^https?://(?:www.)?facebook.com/([^/]+)',
        icon: 'facebook',
        iconSet: 'b',
    },
    instagram: {
        regex: '^https?://(?:www.)?instagram.com/([^/]+)',
        icon: 'instagram',
        iconSet: 'b',
    },
    email: {
        regex: '^mailto:([^/]+)',
        icon: 'envelope',
    },
    reddit: {
        regex: '^https?://(?:www.)?reddit.com/u/([^/]+)',
        icon: 'reddit',
        iconSet: 'b',
    },
    telegram: {
        regex: '^https?://(?:www.)?t.me/([^/]+)',
        icon: 'telegram',
        iconSet: 'b',
    },
    paypal: {
        regex: '^https?://(?:www.)?paypal.me/([^/]+)',
        icon: 'paypal',
        iconSet: 'b',
    },
    discord: {
        regex: '^https?://(?:www.)?discord.gg/([^/]+)',
        icon: 'discord',
        iconSet: 'b',
    },
    cake: {
        regex: '^https://cake.avris.it/([bgoprc][A-E][0-6])$',
        icon: 'https://cake.avris.it/favicon.png',
        homepage: 'https://cake.avris.it',
        name: 'Attraction Layer Cake',
    },
};

export default {
    methods: {
        linkProviders() {
            return LINK_PROVIDERS;
        },
        recommendedLinkProviders() {
            return {
                cake: LINK_PROVIDERS.cake,
            };
        },
        beautifyLink(link) {
            for (let name in LINK_PROVIDERS) {
                if (!LINK_PROVIDERS.hasOwnProperty(name)) { continue; }
                const provider = LINK_PROVIDERS[name];
                const m = link.match(provider.regex);
                if (m) {
                    return {
                        ...provider,
                        text: m[1],
                    };
                }
            }

            return {
                icon: 'globe-europe',
                text: clearUrl(link),
            }
        }
    },
}
