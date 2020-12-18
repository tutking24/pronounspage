import translations from '../data/translations.suml';

export default (key, params = {}, warn = true) => {
    let value = translations;
    for (let part of key.split('.')) {
        value = value[part];
        if (value === undefined) {
            if (warn) {
                console.error('Cannot find translation: ' + key);
            }
            return undefined;
        }
    }

    for (let k in params) {
        if (params.hasOwnProperty(k)) {
            value = Array.isArray(value)
                ? value.map(v => v.replace(new RegExp('%' + k + '%', 'g'), params[k]))
                : value.replace(new RegExp('%' + k + '%', 'g'), params[k]);
        }
    }

    return value;
}
