import Vue from 'vue'
import translator from '../src/translator';
import config from '../data/config.suml';
import {buildDict} from "../src/helpers";
import {DateTime, Settings} from "luxon";
import {decodeTime} from 'ulid';

export default ({ app, store }) => {
    Vue.prototype.$eventHub = new Vue();

    Vue.prototype.$base = process.env.BASE_URL;

    Vue.prototype.$t = (key, params = {}, warn = false) => translator.translate(key, params, warn);
    Vue.prototype.$te = (key) => translator.has(key);
    Vue.prototype.$translateForPronoun = (str, pronoun) =>
        pronoun.format(
            translator.translate(`flags.${str.replace(/ /g, '_').replace(/'/g, `*`)}`, {}, false) || str
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

    store.commit('setSpelling', app.$cookies.get('spelling'));
    store.commit('restoreTranslations', app.$cookies.get('translations'))
    if (app.$cookies.get('translationModeVisible')) {
        store.commit('showTranslationMode');
    }

    Vue.prototype.buildImageUrl = (imageId, size) => `${process.env.CLOUDFRONT}/images/${imageId}-${size}.png`

    Vue.prototype.$loadScript = (name, src) => {
        if (!process.client || document.querySelectorAll(`script.${name}-script`).length > 0) {
            return new Promise((resolve, reject) => { resolve(); });
        }

        let resolveFn; let rejectFn;
        const promise = new Promise((resolve, reject) => {
            resolveFn = resolve;
            rejectFn = reject;
        });

        const s = document.createElement('script');
        s.setAttribute('src', src);
        s.classList.add(`${name}-script`);
        s.onload = resolveFn;
        s.onerror = rejectFn;
        document.body.appendChild(s);

        return promise;
    };

    Settings.defaultLocale = config.locale;

    Vue.prototype.$datetime = (timestamp) => {
        const dt = DateTime.fromSeconds(timestamp);
        return dt.toFormat('y-MM-dd HH:mm')
    }

    Vue.prototype.$ulidTime = (ulid) => {
        return decodeTime(ulid) / 1000;
    }
}
