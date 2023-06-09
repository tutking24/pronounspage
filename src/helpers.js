import md5 from 'js-md5';
import {Base64} from 'js-base64';
import _ from 'lodash';

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

export const head = ({title, description, banner, noindex = false, keywords}) => {
    const meta = { meta: [] };

    if (title) {
        title = title.replace(/&#39;/g, '\'');
        title = clearLinkedText(title, false);
        title += ' • ' + process.env.TITLE;
        meta.title = title;
        meta.meta.push({ hid: 'og:title', property: 'og:title', content: title });
        meta.meta.push({ hid: 'twitter:title', property: 'twitter:title', content: title });
    }

    if (description) {
        description = clearLinkedText(description);
        description = description.split(' ').slice(0, 24).join(' ') + '…';
        meta.meta.push({ hid: 'description', name: 'description', content: description });
        meta.meta.push({ hid: 'og:description', property: 'og:description', content: description });
        meta.meta.push({ hid: 'twitter:description', property: 'twitter:description', content: description });
    }

    if (banner) {
        banner = process.env.BASE_URL + '/' + banner.replace(/^\//, '');
        meta.meta.push({ hid: 'og:image', property: 'og:image', content: banner });
        meta.meta.push({ hid: 'twitter:image', property: 'twitter:image', content: banner });
    }

    if (noindex) {
        meta.meta.push({ hid: 'robots', name: 'robots', content: 'noindex'});
    }

    if (keywords) {
        meta.meta.push({ hid: 'keywords', name: 'keywords', content: process.env.KEYWORDS + ', ' + keywords.join(', ')});
    }

    return meta;
}

export const clearUrl = url => {
    url = url.trim()
        .replace('http://www.', '')
        .replace('https://www.', '')
        .replace('http://', '')
        .replace('https://', '')
        .replace('mailto:', '');

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

    url = decodeURIComponent(url);

    return url;
}

export const makeId = (length, characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') => {
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

export const fallbackAvatar = (user, size = 240) => {
    return `https://avi.avris.it/shape-${size}/${Base64.encode(user.username).replace(/\+/g, '-').replace(/\//g, '_')}.png`;
}

export const gravatar = (user, size = 240) => {
    return `https://www.gravatar.com/avatar/${user.emailHash || md5(user.email)}?d=${encodeURIComponent(fallbackAvatar(user, size))}&s=${size}`;
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
    return parseInt(Date.now() / 1000);
}

export const isEmoji = char => {
    return _.toArray(char).length === 1 && !!char.trim().match(/(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/)
}

export const isTroll = (body) => {
    return ['cipeusz', 'feminazi', 'bruksela', 'zboczeń'].some(t => body.indexOf(t) > -1);
}

export const zip = (list, reverse) => {
    return buildDict(function* () {
        for (let [k, v] of list) {
            yield reverse ? [v, k] : [k, v];
        }
    });
}

// https://stackoverflow.com/a/6274381/3297012
export const shuffle = array => {
    const a = [...array];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

export const isGranted = (user, locale, area = '') => {
    if (area === '*') {
        return user.roles.split('|').includes('*');
    }

    for (let permission of user.roles.split('|')) {
        if (permission === '*' && area !== 'code' && area !== 'org') {
            return true;
        }
        const [ permissionLocale, permissionArea ] = permission.split('-');
        if ((permissionLocale === '*' || permissionLocale === locale || locale === null)
            && ((permissionArea === '*' && area !== 'code' && area !== 'org') || permissionArea === area || area === '' || (area === 'panel' && permissionArea !== 'users'))
        ) {
            return true;
        }
    }

    return false;
}

export const handleErrorAsync = func => (req, res, next) => {
    func(req, res, next).catch((error) => next(error));
};

export const clearLinkedText = (text, quotes = true) => {
    text = text
        .replace(/{[^}=]+=([^}=]+)}/g, '$1')
        .replace(/{([^}=]+)}/g, '$1');

    if (quotes) {
        text = text.replace(/[„”"']/g, '');
    }

    text = text.replace(/\s+/g, ' ');

    return text;
}

export const sortClearedLinkedText = (items, key) => {
    items.sort((a, b) => clearLinkedText(a[key].toLowerCase()).localeCompare(clearLinkedText(b[key].toLowerCase())))
    return items;
}

export const clearKey = (key) => {
    if (!key) { return null; }
    return key.replace(/'/g, '_').toLowerCase();
}

export const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

const escapeChars = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;'
};

export const escapeHtml = (text) => text.replace(/[&<>"]/g, tag => escapeChars[tag] || tag);

export class ImmutableArray extends Array {
    sorted(a, b) {
        return new ImmutableArray(...[...this].sort(a, b));
    }

    randomElement() {
        return this[Math.floor(Math.random() * this.length)];
    }

    groupBy(m) {
        const keys = {}
        const grouped = new ImmutableArray();
        for (let el of this) {
            const key = m(el);
            if (!keys.hasOwnProperty(key)) {
                keys[key] = grouped.length;
                grouped.push([key, new ImmutableArray()]);
            }
            grouped[keys[key]][1].push(el);
        }

        return grouped;
    }

    indexOrFallback(index, fallback) {
        return this.length > index ? this[index] : fallback;
    }
}

export const groupBy = function(list, fn) {
    const grouped = {};
    for (let el of list) {
        const key = fn(el);
        if (!grouped.hasOwnProperty(key)) {
            grouped[key] = [];
        }
        grouped[key].push(el);
    }

    return grouped;
}

export const obfuscateEmail = (email) => {
    const [ username, hostname ] = email.toLowerCase().split('@');
    const tld = hostname.split('.').slice(-1).pop();

    if (tld === 'oauth') {
        return null;
    }

    const usernamePublic = username.substring(0, username.length <= 5 ? 1 : 3);

    return `${usernamePublic}*****@*****.${tld}`;
}

// https://newbedev.com/dynamic-deep-setting-for-a-javascript-object
export const deepSet = (obj, path, value) => {
    let a = path.split('.')
    let o = obj;
    while (a.length - 1) {
        let n = a.shift()
        if (!(n in o)) o[n] = {}
        o = o[n]
    }
    o[a[0]] = value
}

export const findAdmins = async (db, locale, area) => {
    const admins = await db.all(`SELECT username, email, roles, adminNotifications FROM users WHERE roles != ''`);
    return admins.filter(admin => isGranted(admin, locale, area));
};

export const isValidLink = (url) => {
    try {
        url = new URL(url);
        return ['http:', 'https:', 'mailto:'].includes(url.protocol);
    } catch {
        return false;
    }
}

