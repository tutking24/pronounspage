import jwt from 'jsonwebtoken';

export const state = () => ({
    token: null,
    user: null,
    spelling: 'traditional',
})

export const mutations = {
    setToken(state, token) {
        if (!token) {
            state.token = null;
            state.user = null;
            return;
        }

        let user;
        try {
            user = jwt.verify(token, process.env.PUBLIC_KEY, {
                algorithm: 'RS256',
                audience: process.env.ALL_LOCALES_URLS.split(','),
                issuer: process.env.ALL_LOCALES_URLS.split(','),
            });
        } catch (e) {
            console.error(e);
            user = null;
        }

        if (user && user.authenticated) {
            state.token = token;
            state.user = user;
            return;
        }

        state.token = null;
        state.user = null;
    },
    setSpelling(state, spelling) {
        state.spelling = spelling;
    },
}
