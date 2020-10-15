import Vue from 'vue';
import t from "../src/translator";

export default ({app, store}) => {
    const token = app.$cookies.get('token');
    if (token) {
        store.commit('setToken', token);
        if (!store.state.token) {
            app.$cookies.removeAll();
        }
    }

    Vue.prototype.$user = _ => store.state.user;
    Vue.prototype.$auth = _ => {
        return store.state.token ? {
            authorization: 'Bearer ' + store.state.token,
        } : {};
    };
    Vue.prototype.$admin = _ => {
        return store.state.user && store.state.user.authenticated && store.state.user.roles === 'admin';
    };
}
