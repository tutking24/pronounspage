import Vue from 'vue'
import t from '../src/translator';
import config from '../data/config.suml';
import {buildDict} from "../src/helpers";
import {DateTime} from "luxon";

export default ({ app, store }) => {
    Vue.prototype.$eventHub = new Vue();

    Vue.prototype.$base = process.env.BASE_URL;

    Vue.prototype.$t = t;
    Vue.prototype.$translateForPronoun = (str, pronoun) =>
        pronoun.format(
            t(`flags.${str.replace(/ /g, '_').replace(/'/g, `*`)}`, {}, false) || str
        );

    Vue.prototype.config = config;

    Vue.prototype.locales = buildDict(function* () {
        if (config.locale !== '_') {
            yield [ config.locale, process.env.LOCALES[config.locale] ];
        }
        for (let l in process.env.LOCALES) {
            if (process.env.LOCALES.hasOwnProperty(l) && l !== config.locale) {
                yield [l, process.env.LOCALES[l]];
            }
        }
    });

    store.commit('setSpelling', app.$cookies.get('spelling') || 'traditional');

    Vue.prototype.buildImageUrl = (imageId, size) => `${process.env.BUCKET}/images/${imageId}-${size}.png`

    Vue.prototype.$loadScript = (name, src) => {
        if (!process.client || document.querySelectorAll(`script.${name}-script`).length > 0) {
            return;
        }

        const s = document.createElement('script');
        s.setAttribute('src', src);
        s.classList.add(`${name}-script`);
        document.body.appendChild(s);
    };

    Vue.prototype.$datetime = (timestamp) => {
        const dt = DateTime.fromSeconds(timestamp);
        return dt.toFormat('y-MM-dd HH:mm')
    }
}
