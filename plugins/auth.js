import Vue from 'vue';
import config from '../data/config.suml';
import {isGranted} from "../src/helpers";

export default ({app, store}) => {
    const token = app.$cookies.get('token');
    if (token) {
        store.commit('setToken', token);
        if (!store.state.token) {
            app.$cookies.removeAll();
        }
    }

    Vue.prototype.$user = _ => store.state.user;
    Vue.prototype.$isGranted = (area) => {
        return store.state.user && store.state.user.authenticated && isGranted(store.state.user, config.locale, area);
    }
}
