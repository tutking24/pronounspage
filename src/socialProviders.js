export const socialProviders = {
    mastodon: {
        name: 'Mastodon',
        instanceRequired: true,
        linkRegex: (p) => `^https?://(?:www.)?${p.name.split('@')[1]}/(?:(?:web/)?@|users/)?${p.name.split('@')[0]}/?$`,
        avatars: true,
    },
    indieauth: {
        name: 'IndieAuth',
        instanceRequired: true,
        icon: 'indieauth.png',
        iconMargin: true,
        avatars: false,
    },
    twitter: {
        name: 'Twitter',
        linkRegex: (p) => `^https?://(?:www.)?twitter.com/${p.name}/?$`,
        redirectViaHome: true,
        avatars: true,
    },
    discord: {
        name: 'Discord',
        redirectViaHome: true,
        avatars: true,
    },
    facebook: {
        name: 'Facebook',
        redirectViaHome: true,
        avatars: false,
    },
    google: {
        name: 'Google',
        redirectViaHome: true,
        avatars: true,
    },
}
