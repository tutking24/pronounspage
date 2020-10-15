import jwt from 'jsonwebtoken';
import { Session } from '../src/helpers';

export const state = () => ({
    token: null,
    user: null,
})

export const mutations = {
    setToken(state, token) {
        if (!token) {
            state.token = null;
            state.user = null;
            Session.remove('token');
            return;
        }

        const user = jwt.verify(token, process.env.PUBLIC_KEY, {
            algorithm: 'RS256',
            audience: process.env.BASE_URL,
            issuer: process.env.BASE_URL,
        });

        if (user && user.authenticated) {
            state.token = token;
            state.user = user;
            Session.set('token', token);
            return;
        }

        state.token = null;
        state.user = null;
        Session.remove('token');
    }
}
