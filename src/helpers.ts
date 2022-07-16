import md5 from 'js-md5';
import {Base64} from 'js-base64';
import _ from 'lodash';


export type SortOfIterable<T> = Iterable<T> | Generator<T>;

export const buildDict = <K extends keyof any, V, Args extends any[] = any[]>(fn: (...args: Args) => SortOfIterable<[K, V]>, ...args: Args): Record<K, V> => {
    const dict: Record<K, V> = {} as Record<K, V>;
    for (let [key, value] of fn(...args)) {
        dict[key] = value;
    }
    return dict;
}


export const buildList = <V, Args extends any[]>(fn: (...args: Args) => SortOfIterable<V>, ...args: Args): V[] => {
    const list = [];
    for (let value of fn(...args)) {
        list.push(value);
    }
    return list;
}

interface HeadParams {
    title: string;
    description: string;
    banner: string;
    noindex?: boolean;
}
export const head = ({title, description, banner, noindex = false}: HeadParams) => {
    type MetaValue = { hid: string, name?: string, property?: string, content: string };
    type Meta = { meta: MetaValue[], title?: string };
    const meta: Meta = { meta: [] };

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

    return meta;
}

export const clearUrl = (url: string) => {
    url = url.trim()
        .replace('http://www.', '')
        .replace('https://www.', '')
        .replace('http://', '')
        .replace('https://', '')
        .replace('mailto:', '');

    const qPos = url.indexOf('?')
    if (qPos > -1) {
        url = url.substring(0, qPos);
    }

    const hPos = url.indexOf('#')
    if (hPos > -1) {
        url = url.substring(0, hPos);
    }

    if (url.substring(url.length - 1) === '/') {
        url = url.substring(0, url.length - 1);
    }

    url = decodeURIComponent(url);

    if (url.length > 48) {
        url = url.substring(0, 28) + '...' + url.substring(url.length - 17);
    }

    return url;
}

export const makeId = (length: number, characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') => {
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

export const fallbackAvatar = (user: Zaimki.User, size = 240) => {
    return `https://avi.avris.it/${size}/${Base64.encode(user.username).replace(/\+/g, '-').replace(/\//g, '_')}.png`;
}

export const gravatar = (user: Zaimki.User, size = 240) => {
    return `https://www.gravatar.com/avatar/${user.emailHash || md5(user.email)}?d=${encodeURIComponent(fallbackAvatar(user, size))}&s=${size}`;
}

type DictEntry<K, V> = { key: K; value: V; }
export const dictToList = <K extends keyof any, V>(dict: Record<K, V>): DictEntry<K, V>[] => {
    const list = [];
    for (let key in dict) {
        if (dict.hasOwnProperty(key)) {
            list.push({key, value: dict[key]});
        }
    }
    return list;
}

export const listToDict = <K extends keyof any, V>(list: DictEntry<K, V>[]): Record<K, V> => {
    if (Object.keys(list).length === 0) {
        return {} as Record<K, V>
    }
    const dict = {} as Record<K, V>;
    for (let el of list) {
        dict[el.key] = el.value;
    }
    return dict;
}

export const curry = function <FuncArgs extends any[]>(func: (...args: FuncArgs) => void) {
    return function curried(...args: Partial<FuncArgs>) {
        if (args.length >= func.length) {
            return func.apply(this, args as FuncArgs);
        } else {
            return function (...args2: Partial<FuncArgs>) {
                return curried.apply(this, args.concat(args2) as FuncArgs);
            }
        }
    };
}

export const capitalise = function (word: string) {
    return word.substring(0, 1).toUpperCase() + word.substring(1);
}

export const camelCase = function (words: string[]) {
    const text = words.map(capitalise).join('');
    return text.substring(0, 1).toLowerCase() + text.substring(1);
}

export const now = function () {
    return Math.floor(Date.now() / 1000);
}

export const isEmoji = (char: string) => {
    return _.toArray(char).length === 1 && !!char.trim().match(/(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/)
}

export const isTroll = (body: string) => {
    return ['cipeusz', 'feminazi', 'bruksela', 'zboczeń'].some(t => body.indexOf(t) > -1);
}

export function zip<K extends keyof any, V>(list: Array<[K, V]>, reverse: false): Record<K, V>;
export function zip<K, V extends keyof any>(list: Array<[K, V]>, reverse: true): Record<V, K>;
export function zip<K extends keyof any, V extends keyof any>(list: Array<[K, V]>, reverse: boolean) {
    // NOTE(tecc): this is so that typescript doesn't freak out
    //             it also provides a technical performance boost because it doesn't need to check every iteration
    return reverse ? buildDict(function* () {
        for (let [k, v] of list) {
            yield [v, k];
        }
    }) : buildDict(function* () {
        for (let [k, v] of list) {
            yield [k, v];
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
        if (permission === '*') {
            return true;
        }
        const [ permissionLocale, permissionArea ] = permission.split('-');
        if ((permissionLocale === '*' || permissionLocale === locale) && (permissionArea === '*' || permissionArea === area || area === '')) {
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
    sorted(a) {
        return new ImmutableArray(...[...this].sort(a));
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

export const obfuscateEmail = (email) => {
    const [ username, hostname ] = email.toLowerCase().split('@');
    const tld = hostname.split('.').slice(-1).pop();

    if (tld === 'oauth') {
        return null;
    }

    const usernamePublic = username.substring(0, username.length <= 5 ? 1 : 3);

    return `${usernamePublic}*****@*****.${tld}`;
}
