import translations from './server/translations';

const title = translations.title;
const description = translations.description;
const banner = process.env.BASE_URL + '/banner/zaimki.png';
const colour = '#C71585';

const bodyParser = require('body-parser');

export default {
    mode: 'universal',
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
            { hid: 'og:logo', property: 'og:logo', content: banner },

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
    ],
    components: true,
    buildModules: [],
    modules: [
        '@nuxtjs/pwa',
        '@nuxtjs/axios',
    ],
    pwa: {
        manifest: {
            name: title,
            short_name: title,
            description: description,
            background_color: '#ffffff',
            theme_color: colour,
            lang: 'pl',
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
        },
    },
    env: {
        baseUrl: process.env.BASE_URL,
        secret: process.env.SECRET,
        lang: process.env.LANG,
    },
    serverMiddleware: {
        '/': bodyParser.json(),
        '/nouns': '~/server/nouns.js',
        '/banner': '~/server/banner.js',
    },
    axios: {
        baseURL: process.env.BASE_URL,
    },
}
