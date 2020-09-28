import Vue from 'vue'
import t from '../src/translator';

export default ({ app }) => {
    Vue.prototype.$t = t;
}
