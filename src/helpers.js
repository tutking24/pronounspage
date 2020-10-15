export const buildDict = (fn, ...args) => {
    const dict = {};
    for (let [key, value] of fn(...args)) {
        dict[key] = value;
    }
    return dict;
}

export const buildList = (fn, ...args) => {
    const list = [];
    for (let value of fn(...args)) {
        list.push(value);
    }
    return list;
}

export const head = ({title, description, banner}) => {
    const meta = { meta: [] };

    if (title) {
        title += ' • Zaimki.pl';
        meta.title = title;
        meta.meta.push({ hid: 'og:title', property: 'og:title', content: title });
        meta.meta.push({ hid: 'twitter:title', property: 'twitter:title', content: title });
    }

    if (description) {
        meta.meta.push({ hid: 'description', name: 'description', content: description });
        meta.meta.push({ hid: 'og:description', property: 'og:description', content: description });
        meta.meta.push({ hid: 'twitter:description', property: 'twitter:description', content: description });
    }

    if (banner) {
        banner = process.env.BASE_URL + '/' + banner;
        meta.meta.push({ hid: 'og:logo', property: 'og:logo', content: banner });
        meta.meta.push({ hid: 'twitter:image', property: 'twitter:image', content: banner });
    }

    return meta;
}

export const clearUrl = url => {
    url = url.trim()
        .replace('http://www.', '')
        .replace('https://www.', '')
        .replace('http://', '')
        .replace('https://', '');

    const qPos = url.indexOf('?')
    if (qPos > -1) {
        url = url.substr(0, qPos);
    }

    const hPos = url.indexOf('#')
    if (hPos > -1) {
        url = url.substr(0, hPos);
    }

    if (url.substr(url.length - 1) === '/') {
        url = url.substr(0, url.length - 1);
    }

    return decodeURIComponent(url);
}

export const makeId = (length, characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') => {
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

export class Session {
    static isAvailable() {
        return typeof localStorage !== 'undefined';
    }

    static set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    static get(key) {
        const value = localStorage.getItem(key);

        return key === null ? null : JSON.parse(value);
    }

    static has(key) {
        return localStorage.getItem(key) !== null;
    }

    static remove(key) {
        localStorage.removeItem(key);
    }
}
