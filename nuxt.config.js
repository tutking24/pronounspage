require('./src/dotenv')();

import { loadSuml } from './server/loader';
import fs from 'fs';
import path from 'path';
import {buildDict, buildList} from "./src/helpers";
import buildLocaleList from "./src/buildLocaleList";

const config = loadSuml('config');
const translations = loadSuml('translations');

const locale = config.locale;
const locales = buildLocaleList(locale);
const title = translations.title;
const description = translations.description;
const banner = process.env.BASE_URL + '/api/banner/zaimki.png';
const colour = '#C71585';
const logo = fs.readFileSync(__dirname + '/static/logo/logo.svg').toString('utf-8').replace('/></svg>', 'fill="currentColor"/></svg>');

process.env.LOCALE = locale;
if (process.env.ENV) {
    process.env.NODE_ENV = process.env.ENV;
}

const allVersionsUrls = buildList(function*() {
    if (process.env.NODE_ENV === 'development') {
        yield 'http://pronouns.test:3000';
        yield 'http://localhost:3000';
    } else if (process.env.NODE_ENV === 'test') {
        yield 'https://test.pronouns.page';
    } else {
        yield 'https://pronouns.page';
        for (let loc in locales) {
            yield locales[loc].url;
        }
    }
});
process.env.ALL_LOCALES_URLS = allVersionsUrls.join(',');

const bodyParser = require('body-parser');

const buildFlags = () => {
    const flags = [];
    for (let flag of fs.readdirSync(__dirname + '/static/flags/')) {
        let flagDisplay = flag
            .replace(new RegExp('\.png$'), '')
            .replace(new RegExp('_', 'g'), '')
            .trim();

        if (flag.startsWith('.') || flag.startsWith('_')) {
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

const postCssPlugins = [
    require('autoprefixer'),
];

if (config.dir === 'rtl') {
    postCssPlugins.push(require('rtlcss'));
}

const getAllFiles = function(dirPath, arrayOfFiles) {
    arrayOfFiles = arrayOfFiles || [];

    fs.readdirSync(dirPath).forEach(function(file) {
        if (fs.statSync(dirPath + '/' + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + '/' + file, arrayOfFiles)
        } else {
            arrayOfFiles.push(path.join(dirPath, '/', file))
        }
    })

    return arrayOfFiles
}

// TODO(96): Get JSONS again, but in a not locale-specific manner

export default {
    target: 'server',
    head: {
        htmlAttrs: {
            dir: config.dir || 'ltr',
        },
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
            { rel: 'icon', type: 'image/svg', href: '/logo/logo-primary.svg' }
        ],
    },
    css: [],
    plugins: [
        { src: '~/plugins/vue-matomo.js', ssr: false },
        { src: '~/plugins/routerInject.ts' },
        { src: '~/plugins/globals.ts' },
        { src: '~/plugins/auth.js' },
        { src: '~/plugins/datepicker.js', ssr: false },
    ],
    components: true,
    buildModules: [
        '@nuxt/typescript-build',
        [
            '@nuxtjs/router',
            {
                path: 'router',
                fileName: 'index.ts',
                keepDefaultRouter: true,
            },
        ]
    ],
    loaders: {
        ts: {
            configFile: path.resolve(__dirname, 'tsconfig.json'),
            ignoreNotFoundWarnings: true
        }
    },
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
    env: {
        BASE_URL: process.env.BASE_URL,
        HOME_URL: process.env.HOME_URL || 'https://pronouns.page',
        TITLE: title,
        PUBLIC_KEY: fs.readFileSync(__dirname + '/keys/public.pem').toString(),
        CONFIG: config,
        LOCALE: config.locale,
        LOCALES: locales,
        FLAGS: buildFlags(),
        FLAGS_ASTERISK: ['Heteroromantic', 'Heterosexual', 'Monoamorous', 'Monogamous'],
        BUCKET: `https://${process.env.AWS_S3_BUCKET}.s3-${process.env.AWS_REGION}.amazonaws.com`,
        CLOUDFRONT: `https://${process.env.AWS_CLOUDFRONT_ID}.cloudfront.net`,
        STATS_FILE: process.env.STATS_FILE,
        HCAPTCHA_SITEKEY: process.env.HCAPTCHA_SITEKEY,
        ALL_LOCALES_URLS: process.env.ALL_LOCALES_URLS,
        LOGO: logo,
        MIN_AGE: config.ageLimit || 13,
    },
    serverMiddleware: ['~/server/no-ssr.js', '~/server/index.js'],
    build: {
        postcss: {
            plugins: postCssPlugins,
        },
        extend(config, ctx) {
            // console.log("Webpack rules: %O", config.module.rules);
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
    axios: {
        baseURL: process.env.BASE_URL + '/api',
    },
    router: {
        extendRoutes(routes, resolve) {

        },
    },
}
