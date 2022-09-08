import locales from './locales'; // NOTE(tecc): For some reason *this* import doesn't work with absolutes so... this

export type Locale = {
    name: string;
    url: string;
    published: boolean;
    code: string;
}

export default (current, includeUnpublished = false): Record<string, Locale> => {
    const d: Record<string, Locale> = {};
    for (let [code, name, url, published] of locales) {
        if (published || current === code || includeUnpublished) {
            d[code] = {name, url, published, code};
        }
    }
    return d;
}
