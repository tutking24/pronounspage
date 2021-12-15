export const socialProviders = {
    mastodon: {
        name: 'Mastodon',
        instanceRequired: true,
        linkRegex: (p) => `^https?://(?:www.)?${p.name.split('@')[1]}/(?:(?:web/)?@|users/)?${p.name.split('@')[0]}/?$`,
    },
    twitter: {
        name: 'Twitter',
        linkRegex: (p) => `^https?://(?:www.)?twitter.com/${p.name}/?$`,
    },
    discord: {
        name: 'Discord',
    },
    facebook: {
        name: 'Facebook',
    },
    google: {
        name: 'Google',
    },
}
