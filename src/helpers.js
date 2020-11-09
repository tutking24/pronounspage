import md5 from 'js-md5';
import { Base64 } from 'js-base64';

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
        title += ' • ' + process.env.TITLE;
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

export const gravatar = (user, size = 128) => {
    const fallback = `https://avi.avris.it/${size}/${Base64.encode(user.username).replace(/\+/g, '-').replace(/\//g, '_')}.png`;

    return `https://www.gravatar.com/avatar/${user.emailHash || md5(user.email)}?d=${encodeURIComponent(fallback)}&s=${size}`;
}

export const dictToList = dict => {
    const list = [];
    for (let key in dict) {
        if (dict.hasOwnProperty(key)) {
            list.push({key, value: dict[key]});
        }
    }
    return list;
}

export const listToDict = list => {
    if (Object.keys(list).length === 0) {
        return {}
    }
    const dict = {};
    for (let el of list) {
        dict[el.key] = el.value;
    }
    return dict;
}

export const curry = function (func) {
    return function curried(...args) {
        if (args.length >= func.length) {
            return func.apply(this, args);
        } else {
            return function(...args2) {
                return curried.apply(this, args.concat(args2));
            }
        }
    };
}

export const capitalise = function (word) {
    return word.substring(0, 1).toUpperCase() + word.substring(1);
}

export const camelCase = function (words) {
    const text = words.map(capitalise).join('');
    return text.substring(0, 1).toLowerCase() + text.substring(1);
}

export const now = function () {
    return Math.floor(Date.now() / 1000);
}
