export default {
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
    }
}
