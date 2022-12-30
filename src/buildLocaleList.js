const locales = require('./locales')

module.exports = (current, includeUnpublished = false) => {
    const d = {};
    for (let [code, name, url, published] of locales) {
        if (published || current === code || includeUnpublished) {
            d[code] = {name, url, published, code};
        }
    }

    // hoist current to top, then published, then unpublished
    const sortedLocales = {};
    if (d[current] !== undefined) {
        sortedLocales[current] = d[current];
    }
    for (let [code, localeConfig] of Object.entries(d)) {
        if (code !== current && localeConfig.published) {
            sortedLocales[code] = localeConfig;
        }
    }
    for (let [code, localeConfig] of Object.entries(d)) {
        if (code !== current && !localeConfig.published) {
            sortedLocales[code] = localeConfig;
        }
    }

    return sortedLocales;
}
