export default ({app, store}) => {
    const token = app.$cookies.get('token');
    if (token) {
        store.commit('setToken', token);
        if (!store.state.token) {
            app.$cookies.removeAll();
        }
    }
}
