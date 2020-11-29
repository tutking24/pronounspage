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
        banner = process.env.BASE_URL + '/' + banner.replace(/^\//, '');
        meta.meta.push({ hid: 'og:image', property: 'og:image', content: banner });
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

export const isEmoji = char => {
    return !!char.match(/^(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])$/)
}

export const isTroll = (body) => {
    return ['cipeusz', 'feminazi', 'bruksela', 'zboczeń'].some(t => body.indexOf(t) > -1);
}

export const buildLocaleList = () => {
    return buildDict(function* () {
        for (let locale of process.env.LOCALES.split('|')) {
            const [code, name, url] = locale.split(',');
            yield [code, {name, url}];
        }
    })
}

export const zip = (list, reverse) => {
    return buildDict(function* () {
        for (let [k, v] of list) {
            yield reverse ? [v, k] : [k, v];
        }
    });
}

export const sortByValue = (obj, reverse = false) => {
    const sortedArray = [];
    for (let i in obj) {
        if (obj.hasOwnProperty(i)) {
            sortedArray.push([parseInt(obj[i]), i]);
        }
    }
    return zip(sortedArray.sort((a, b) => reverse ? b[0] - a[0] : a[0] - b[0]), true);
}
