export const socialProviders = {
    twitter: {
        name: 'Twitter',
        linkRegex: (p) => `^https?://(?:www.)?twitter.com/${p.name}/?$`,
    },
    facebook: {
        name: 'Facebook',
    },
    google: {
        name: 'Google',
    },
    discord: {
        name: 'Discord',
    },
    mastodon: {
        name: 'Mastodon',
        instanceRequired: true,
        linkRegex: (p) => `^https?://(?:www.)?${p.name.split('@')[1]}/(?:web/)?@${p.name.split('@')[0]}/?$`,
    },
}
