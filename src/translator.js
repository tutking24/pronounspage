import translations from '../data/translations.suml';

export default key => {
    let value = translations;
    for (let part of key.split('.')) {
        value = value[part];
        if (value === undefined) {
            console.error('Cannot find translation: ' + key);
            return undefined;
        }
    }

    return value;
}
