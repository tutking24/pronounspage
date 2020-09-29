import Vue from 'vue'
import t from '../src/translator';
import config from '../data/config.suml';
import { locales } from '../src/data';

export default ({ app }) => {
    Vue.prototype.$t = t;
    Vue.prototype.config = config;
    Vue.prototype.locales = locales;
}
