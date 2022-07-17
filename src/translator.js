import translations from '../data/translations.suml';

export default (key, params = {}, warn = true, translate = true) => {
    let value = translations;
    if (translate) {
        for (let part of key.split('.')) {
            value = value[part];
            if (value === undefined) {
                if (warn) {
                    console.error('Cannot find translation: ' + key);
                }
                return undefined;
            }
        }
    } else {
        value = key;
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
