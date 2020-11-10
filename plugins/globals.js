import Vue from 'vue'
import t from '../src/translator';
import config from '../data/config.suml';
import { locales } from '../src/data';
import {buildDict} from "../src/helpers";

export default ({ app }) => {
    Vue.prototype.$base = process.env.BASE_URL;
    Vue.prototype.$t = t;
    Vue.prototype.config = config;
    Vue.prototype.locales = buildDict(function* () {
        if (config.locale !== '_') {
            yield [ config.locale, locales[config.locale] ];
        }
        for (let l in locales) {
            if (locales.hasOwnProperty(l) && l !== config.locale) {
                yield [l, locales[l]];
            }
        }
    });
}
