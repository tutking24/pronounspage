import { loadSuml } from './server/loader';
import fs from 'fs';
import {buildDict, buildLocaleList} from "./src/helpers";

const config = loadSuml('config');
const translations = loadSuml('translations');

const locale = config.locale;
const locales = buildLocaleList(locale);
const title = translations.title;
const description = translations.description;
const banner = process.env.BASE_URL + '/api/banner/zaimki.png';
const colour = '#C71585';

const bodyParser = require('body-parser');

const buildFlags = () => {
    const flags = [];
    for (let flag of fs.readdirSync(__dirname + '/static/flags/')) {
        let flagDisplay = flag
            .replace(new RegExp('\.png$'), '')
            .replace(new RegExp('_', 'g'), '')
            .trim();

        if (flag.startsWith('.')) {
            continue;
        }

        if (flag.startsWith('-')) {
            const tell = '-' + config.locale + '-';
            if (flag.startsWith(tell)) {
                flagDisplay = flagDisplay.substring(tell.length);
            } else {
                continue;
            }
        }

        flags.push([
            flag.replace(new RegExp('\.png$'), ''),
            flagDisplay,
        ]);
    }

    flags.sort((a, b) => a[1].localeCompare(b[1]));

    return buildDict(function *() {
        for (let [key, display] of flags) {
            yield [key, display];
        }
    });
};

export default {
    target: 'server',
    head: {
        title: title,
        meta: [
            { charset: 'utf-8' },

            { hid: 'description', name: 'description', content: description },

            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'apple-mobile-web-app-title', name: 'apple-mobile-web-app-title', content: title },
            { hid: 'theme-color', name: 'theme-color', content: colour },

            { hid: 'og:type', property: 'og:type', content: 'article' },
            { hid: 'og:title', property: 'og:title', content: title },
            { hid: 'og:description', property: 'og:description', content: description },
            { hid: 'og:site_name', property: 'og:site_name', content: title },
            { hid: 'og:image', property: 'og:image', content: banner },

            { hid: 'twitter:card', property: 'twitter:card', content: 'summary_large_image' },
            { hid: 'twitter:title', property: 'twitter:title', content: title },
            { hid: 'twitter:description', property: 'twitter:description', content: description },
            { hid: 'twitter:site', property: 'twitter:site', content: process.env.BASE_URL },
            { hid: 'twitter:image', property: 'twitter:image', content: banner },
        ],
        link: [
            { rel: 'icon', type: 'image/svg', href: '/favicon.svg' }
        ],
    },
    css: [],
    plugins: [
        { src: '~/plugins/vue-matomo.js', ssr: false },
        { src: '~/plugins/globals.js' },
        { src: '~/plugins/auth.js' },
    ],
    components: true,
    buildModules: [],
    modules: [
        '@nuxtjs/pwa',
        '@nuxtjs/axios',
        ['@nuxtjs/redirect-module', {
            rules: config.redirects,
        }],
        'cookie-universal-nuxt',
    ],
    pwa: {
        manifest: {
            name: title,
            short_name: title,
            description: description,
            background_color: '#ffffff',
            theme_color: colour,
            lang: locale,
        }
    },
    build: {
        extend (config, ctx) {
            config.module.rules.push({
                test: /\.csv|\.tsv$/,
                loader: 'csv-loader',
                options: {
                    dynamicTyping: true,
                    header: true,
                    skipEmptyLines: true,
                    delimiter: '\t',
                }
            });
            config.module.rules.push({
                test: /\.suml$/,
                loader: 'suml-loader',
            });
            config.module.rules.push({
                test: /\.md$/,
                use: ['html-loader', 'markdown-loader']
            })
        },
    },
    env: {
        BASE_URL: process.env.BASE_URL,
        TITLE: title,
        PUBLIC_KEY: fs.readFileSync(__dirname + '/keys/public.pem').toString(),
        CONFIG: config,
        LOCALE: config.locale,
        LOCALES: locales,
        FLAGS: buildFlags(),
    },
    serverMiddleware: ['~/server/index.js'],
    axios: {
        baseURL: process.env.BASE_URL + '/api',
    },
    router: {
        extendRoutes(routes, resolve) {
            if (config.sources.enabled) {
                routes.push({ path: '/' + config.sources.route, component: resolve(__dirname, 'routes/sources.vue') });
            }

            if (config.nouns.enabled) {
                routes.push({ path: '/' + config.nouns.route, component: resolve(__dirname, 'routes/nouns.vue') });
            }

            if (config.names.enabled) {
                routes.push({ path: '/' + config.names.route, component: resolve(__dirname, 'routes/names.vue') });
            }

            if (config.faq.enabled) {
                routes.push({ path: '/' + config.faq.route, component: resolve(__dirname, 'routes/faq.vue') });
            }

            if (config.links.enabled) {
                routes.push({ path: '/' + config.links.route, component: resolve(__dirname, 'routes/links.vue') });
                routes.push({ path: '/' + config.links.blogRoute + '/:slug', component: resolve(__dirname, 'routes/blog.vue') });
            }

            if (config.people.enabled) {
                routes.push({ path: '/' + config.people.route, component: resolve(__dirname, 'routes/people.vue') });
            }

            if (config.english.enabled) {
                routes.push({ path: '/' + config.english.route, component: resolve(__dirname, 'routes/english.vue') });
            }

            if (config.contact.enabled) {
                routes.push({ path: '/' + config.contact.route, component: resolve(__dirname, 'routes/contact.vue') });
            }

            if (config.census.enabled) {
                routes.push({ path: '/' + config.census.route, component: resolve(__dirname, 'routes/census.vue') });
            }

            if (config.user.enabled) {
                routes.push({path: '/' + config.user.route, component: resolve(__dirname, 'routes/user.vue')});
                routes.push({path: '/' + config.user.termsRoute, component: resolve(__dirname, 'routes/terms.vue')});
            }
            routes.push({ path: '/admin', component: resolve(__dirname, 'routes/admin.vue') });

            if (config.profile.enabled) {
                routes.push({path: '/@*', component: resolve(__dirname, 'routes/profile.vue')});
                if (config.profile.editorEnabled) {
                    routes.push({path: '/editor', component: resolve(__dirname, 'routes/profileEditor.vue')});
                }
            }

            if (config.pronouns.enabled) {
                routes.push({ path: '/' + config.pronouns.any, component: resolve(__dirname, 'routes/any.vue') });
                if (config.pronouns.avoiding) {
                    routes.push({ path: '/' + config.pronouns.avoiding, component: resolve(__dirname, 'routes/avoiding.vue') });
                }
            }

            routes.push({ path: '/api', component: resolve(__dirname, 'routes/api.vue') });

            routes.push({ name: 'all', path: '*', component: resolve(__dirname, 'routes/pronoun.vue') });
        },
    },
}
