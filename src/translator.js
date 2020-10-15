import translations from '../data/translations.suml';

export default (key, params = {}) => {
    let value = translations;
    for (let part of key.split('.')) {
        value = value[part];
        if (value === undefined) {
            console.error('Cannot find translation: ' + key);
            return undefined;
        }
    }

    for (let k in params) {
        if (params.hasOwnProperty(k)) {
            value = value.replace(new RegExp('%' + k + '%', 'g'), params[k])
        }
    }

    return value;
}
