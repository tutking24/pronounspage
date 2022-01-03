const locales = require('./locales')

module.exports = (current, includeUnpublished = false) => {
    const d = {};
    for (let [code, name, url, published] of locales) {
        if (published || current === code || includeUnpublished) {
            d[code] = {name, url, published, code};
        }
    }
    return d;
}
