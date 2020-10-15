import { Session } from "../src/helpers";

export default ({store}) => {
    if (Session.isAvailable()) {
        const token = Session.get('token');
        if (token) {
            store.commit('setToken', token);
        }
    }
}
