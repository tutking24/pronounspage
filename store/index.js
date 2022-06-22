import jwt from 'jsonwebtoken';

export const state = () => ({
    token: null,
    user: null,
    preToken: null,
    spelling: null,
    darkMode: false,
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

        if (user && user.mfaRequired) {
            state.preToken = token;
        }

        if (user && user.authenticated) {
            state.preToken = null;
            state.token = token;
            state.user = user;
            return;
        }

        state.token = null;
        state.user = null;
    },
    cancelMfa(state) {
        state.preToken = null;
    },
    setSpelling(state, spelling) {
        state.spelling = spelling;
    },
    setDarkMode(state, isDark) {
        state.darkMode = isDark;
    }
}
