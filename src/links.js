const AbortController = require('abort-controller');
const fetch = require('node-fetch');
const {JSDOM} = require('jsdom');
const VirtualConsole = require('jsdom/lib/jsdom/virtual-console');
const SQL = require("sql-template-strings");

const normaliseUrl = (url) => {
    try {
        return new URL(url).toString();
    } catch {
        return null;
    }
}
module.exports.normaliseUrl = normaliseUrl;

class LinkAnalyser {
    async analyse(url) {
        url = new URL(url);
        let $document;
        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 10000);
            const htmlString = await (await fetch(url, {signal: controller.signal})).text();
            $document = new JSDOM(htmlString, { virtualConsole: new VirtualConsole() });
        } catch (e) {
            return {
                url: url.toString(),
                error: e,
            };
        }

        return {
            url: url.toString(),
            relMe: await this._findRelMe($document),
            favicon: (await this._findFavicon(url, $document)).toString(),
            nodeinfo: await this._fetchNodeInfo(url),
        }
    }

    async _findRelMe($document) {
        const links = new Set();
        for (let $el of $document.window.document.querySelectorAll('[rel=me]')) {
            if (!['A', 'LINK'].includes($el.tagName)) { continue; }
            const link = ($el.attributes.value || $el.attributes.href)?.value;
            if (!link) { continue; }

            links.add(link);
        }
        return [...links];
    }

    async _findFavicon(url, $document) {
        for (let $el of $document.window.document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"], link[rel="mask-icon"]')) {
            const link = $el.attributes.href?.value;
            if (!link) { continue; }

            return new URL(link, url);
        }

        try {
            const fallback = new URL('/favicon.ico', url);
            const res = await fetch(fallback);
            if (res.ok) {
                return fallback;
            }
        } catch {}

        return null;
    }

    async _fetchNodeInfo(url) {
        try {
            const res = await fetch(new URL('/.well-known/nodeinfo', url));
            if (res.status !== 200) { return null; }
            const link = (await res.json())?.links?.[0]?.href;
            if (!link) { return null; }

            return await (await fetch(new URL(link, url))).json();
        } catch {
            return null;
        }
    }
}
module.exports.LinkAnalyser = LinkAnalyser;
