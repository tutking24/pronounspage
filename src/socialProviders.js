export const socialProviders = {
    mastodon: {
        name: 'Mastodon',
        instanceRequired: true,
        linkRegex: (p) => `^https?://(?:www.)?${p.name.split('@')[1]}/(?:(?:web/)?@|users/)?${p.name.split('@')[0]}/?$`,
        avatars: true,
    },
    indieauth: {
        name: 'IndieAuth',
        linkRegex: (p) => `^https://(?:www.)?${p.name}/?$`,
        instanceRequired: true,
        domain: true,
        icon: 'indieauth.png',
        iconMargin: true,
        avatars: false,
    },
    discord: {
        name: 'Discord',
        redirectViaHome: true,
        avatars: true,
    },
    apple: {
        name: 'Apple',
        redirectViaHome: true,
        avatars: true,
    },
    google: {
        name: 'Google',
        redirectViaHome: true,
        avatars: true,
    },
    twitter: {
        name: 'Twitter',
        linkRegex: (p) => `^https?://(?:www.)?twitter.com/${p.name}/?$`,
        redirectViaHome: true,
        avatars: true,
        deprecated: 'https://en.pronouns.page/blog/twitter-login-deprecated',
    },
    facebook: {
        name: 'Facebook',
        redirectViaHome: true,
        avatars: false,
        deprecated: 'https://en.pronouns.page/blog/facebook-login-deprecated',
    },
}
