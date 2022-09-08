export const config = {
    defaults: {
        origin: process.env.BASE_URL,
        transport: 'session',
        state: true,
        prefix: '/api/connect',
        scope: ['email'],
        response: ['tokens', 'raw', 'profile'],
    },
    twitter: {
        key: process.env.TWITTER_KEY,
        secret: process.env.TWITTER_SECRET,
        callback: '/api/user/social/twitter',
        profile_url: 'https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true',
    },
    facebook: {
        key: process.env.FACEBOOK_KEY,
        secret: process.env.FACEBOOK_SECRET,
        callback: '/api/user/social/facebook',
        profile_url: 'https://graph.facebook.com/me?fields=email,name,picture'
    },
    google: {
        key: process.env.GOOGLE_KEY,
        secret: process.env.GOOGLE_SECRET,
        callback: '/api/user/social/google',
    },
    discord: {
        key: process.env.DISCORD_KEY,
        secret: process.env.DISCORD_SECRET,
        callback: '/api/user/social/discord',
        scope: ['identify', 'email'],
    },
    // non-grant, but things break if it's not there
    mastodon: {},
    indieauth: {},
}

export const handlers = {
    twitter(r) {
        return {
            id: r.profile.id_str,
            email: r.profile.email,
            name: r.profile.screen_name,
            avatar: r.profile.profile_image_url_https.replace('_normal', '_400x400'),
            access_token: r.access_token,
            access_secret: r.access_secret,
        }
    },
    facebook(r) {
        return {
            id: r.profile.id,
            email: r.profile.email,
            name: r.profile.name,
            avatar: r.profile.picture.data.url,
            access_token: r.access_token,
            access_secret: r.access_secret,
        }
    },
    google(r) {
        return {
            id: r.profile.sub,
            email: r.profile.email_verified !== false ? r.profile.email : undefined,
            name: r.profile.email,
            avatar: r.profile.picture,
            access_token: r.access_token,
            access_secret: r.access_secret,
        }
    },
    discord(r) {
        return {
            id: r.profile.id,
            email: r.profile.email,
            name: r.profile.username,
            username: r.profile.username + '#' + r.profile.discriminator,
            avatar: `https://cdn.discordapp.com/avatars/${r.profile.id}/${r.profile.avatar}`,
            access_token: r.access_token,
            access_secret: r.access_secret,
        }
    },
    mastodon(r) {
        const acct = `${r.profile.username}@${r.instance}`;
        return {
            id: acct,
            // very possibly not really operated by the user
            email: acct,
            name: acct,
            avatar: r.profile.avatar,
            access_token: r.access_token,
            instance: r.instance,
        };
    },
    indieauth(r) {
        return {
            id: r.profile.me,
            email: 'indieauth@' + r.profile.domain,
            name: r.profile.domain,
            instance: r.instance,
        }
    },
};
