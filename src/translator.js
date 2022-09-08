import translations from '../data/translations.suml';
import baseTranslations from '../locale/_base/translations.suml';
import expectedTranslations from '../locale/expectedTranslations';

class Translator {
    constructor(translations, baseTranslations, expectedTranslations) {
        this.translations = translations;
        this.baseTranslations = baseTranslations;
        this.expectedTranslations = expectedTranslations;
    }

    translate(key, params = {}, warn = true) {
        return this.applyParams(
            this.get(key, warn),
            params,
        );
    }

    get(key, warn = false, base = false, useFallback = true) {
        let value = base ? this.baseTranslations : this.translations;
        for (let part of key.split('.')) {
            value = value[part];
            if (value === undefined) {
                if (warn) {
                    console.error('Cannot find translation: ' + key);
                }
                if (!base && useFallback) {
                    return this.get(key, warn, true);
                }
                return undefined;
            }
        }
        return value;
    }

    has(key) {
        return this.get(key, false, false, false) !== undefined;
    }

    applyParams (value, params = {}) {
        for (let k in params) {
            if (params.hasOwnProperty(k)) {
                value = Array.isArray(value)
                    ? value.map(v => v.replace(new RegExp('%' + k + '%', 'g'), params[k]))
                    : value.replace(new RegExp('%' + k + '%', 'g'), params[k]);
            }
        }
        return value;
    }

    listMissingTranslations() {
        return this.expectedTranslations.filter(k => !this.has(k));
    }
}

export default new Translator(translations, baseTranslations, expectedTranslations);
