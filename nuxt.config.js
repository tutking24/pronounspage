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
const keywords = (translations?.seo?.keywords || []).join(', ')
const banner = process.env.BASE_URL + '/api/banner/zaimki.png';
const colour = '#C71585';
const logo = fs.readFileSync(__dirname + '/static/logo/logo.svg').toString('utf-8').replace('/></svg>', 'fill="currentColor"/></svg>');
const versionFile = __dirname + '/cache/version';
const version = fs.existsSync(versionFile) ? fs.readFileSync(versionFile).toString('utf-8') : null;

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
const jsons = {};
for (let file of getAllFiles(__dirname + '/data/docs')) {
    if (!file.endsWith('.json')) { continue; }
    jsons[path.relative(__dirname + '/data/docs', file)] = JSON.parse(fs.readFileSync(file));
}

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

            { hid: 'keywords', name: 'keywords', content: keywords },

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
        { src: '~/plugins/axios.js' },
        { src: '~/plugins/globals.js' },
        { src: '~/plugins/auth.js' },
        { src: '~/plugins/datepicker.js', ssr: false },
        { src: '~/plugins/track.js', ssr: false }
    ],
    components: true,
    buildModules: [],
    modules: [
        '@privyid/nuxt-csrf',
        '@nuxtjs/pwa',
        '@nuxtjs/axios',
        ['@nuxtjs/redirect-module', {
            rules: config.redirects,
        }],
        'cookie-universal-nuxt',
        'vue-plausible',
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
    plausible: {
        domain: process.env.PLAUSIBLE_DOMAIN || translations.domain,
        // NOTE(privacy): Disables automatic tracking of page views, meaning we have to do it manually
        //                If it's not done manually, a privacy issue occurs, which we *do not want*
        //                - tecc
        enableAutoPageviews: false
    },
    publicRuntimeConfig: {
        plausible: {
            domain: process.env.PLAUSIBLE_DOMAIN || translations.domain,
            apiHost: process.env.PLAUSIBLE_API_HOST,
            enableAutoPageviews: false // see previous comment
        }
    },
    build: {
        postcss: {
            postcssOptions: {
                plugins: postCssPlugins,
            }
        },
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
            });
            config.module.rules.push({
                test: /\.ya?ml$/,
                use: 'yaml-loader',
            })
        },
    },
    env: {
        ENV: process.env.ENV,
        BASE_URL: process.env.BASE_URL,
        HOME_URL: process.env.HOME_URL || 'https://pronouns.page',
        TITLE: title,
        PUBLIC_KEY: fs.readFileSync(__dirname + '/keys/public.pem').toString(),
        CONFIG: config,
        LOCALE: config.locale,
        LOCALES: locales,
        FLAGS: buildFlags(),
        FLAGS_ASTERISK: ['Heteroromantic', 'Heterosexual', 'Monoamorous', 'Monogamous', 'Cis Ally', 'Straight Ally'],
        BUCKET: `https://${process.env.AWS_S3_BUCKET}.s3-${process.env.AWS_REGION}.amazonaws.com`,
        CLOUDFRONT: process.env.CLOUDFRONT,
        STATS_FILE: process.env.STATS_FILE,
        HCAPTCHA_SITEKEY: process.env.HCAPTCHA_SITEKEY,
        ALL_LOCALES_URLS: process.env.ALL_LOCALES_URLS,
        LOGO: logo,
        MIN_AGE: config.ageLimit || 13,
        JSONS: JSON.stringify(jsons),
        PLAUSIBLE_API_HOST: process.env.PLAUSIBLE_API_HOST,
        HEARTBEAT_LINK: process.env.HEARTBEAT_LINK,
        VERSION: version,
        KEYWORDS: keywords,
    },
    serverMiddleware: [
        '~/server/no-ssr.js',
        '~/server/index.js'
    ],
    axios: {
        baseURL: process.env.BASE_URL + '/api',
    },
    router: {
        extendRoutes(routes, resolve) {
            if (config.pronouns.enabled) {
                routes.push({ path: '/' + encodeURIComponent(config.pronouns.route), component: resolve(__dirname, 'routes/pronouns.vue') });
            }

            if (config.sources.enabled) {
                routes.push({ path: '/' + encodeURIComponent(config.sources.route), component: resolve(__dirname, 'routes/sources.vue') });
            }

            if (config.nouns.enabled) {
                routes.push({ path: '/' + encodeURIComponent(config.nouns.route), component: resolve(__dirname, 'routes/nouns.vue') });
                for (let subroute of config.nouns.subroutes || []) {
                    routes.push({ path: '/' + encodeURIComponent(subroute), component: resolve(__dirname, `data/nouns/${subroute}.vue`) });
                }
            }

            if (config.inclusive.enabled) {
                routes.push({path: '/' + encodeURIComponent(config.inclusive.route), component: resolve(__dirname, 'routes/inclusive.vue')});
            }
            if (config.terminology.enabled) {
                routes.push({path: '/' + encodeURIComponent(config.terminology.route), component: resolve(__dirname, 'routes/terminology.vue')});

                // TODO remove later
                routes.push({path: '/' + encodeURIComponent(config.nouns.route) + '/' + encodeURIComponent(config.terminology.route), component: resolve(__dirname, 'routes/terminology.vue')});
            }

            if (config.names.enabled) {
                routes.push({ path: '/' + encodeURIComponent(config.names.route), component: resolve(__dirname, 'routes/names.vue') });
            }

            if (config.faq.enabled) {
                routes.push({ path: '/' + encodeURIComponent(config.faq.route), component: resolve(__dirname, 'routes/faq.vue') });
            }

            if (config.links.enabled) {
                routes.push({ path: '/' + encodeURIComponent(config.links.route), component: resolve(__dirname, 'routes/links.vue') });
                if (config.links.academicRoute) {
                    routes.push({ path: '/' + encodeURIComponent(config.links.academicRoute), component: resolve(__dirname, 'routes/academic.vue') });
                }
                if (config.links.mediaRoute) {
                    routes.push({ path: '/' + encodeURIComponent(config.links.mediaRoute), component: resolve(__dirname, 'routes/media.vue') });
                }
            }

            if (config.links.blog) {
                routes.push({ path: '/' + encodeURIComponent(config.links.blogRoute), component: resolve(__dirname, 'routes/blog.vue'), name: 'blog' });
                routes.push({ path: '/' + encodeURIComponent(config.links.blogRoute) + '/:slug', component: resolve(__dirname, 'routes/blogEntry.vue'), name: 'blogEntry' });
                if (config.blog && config.blog.shortcuts) {
                    for (let shortcut in config.blog.shortcuts) {
                        if (!config.blog.shortcuts.hasOwnProperty(shortcut)) { continue; }
                        const slug = config.blog.shortcuts[shortcut];
                        routes.push({ path: '/' + encodeURIComponent(shortcut), component: resolve(__dirname, 'routes/blogEntry.vue'), meta: {slug}, name: 'blogEntryShortcut:' + shortcut });
                    }
                }
            }

            if (config.links.zine && config.links.zine.enabled) {
                routes.push({ path: '/' + encodeURIComponent(config.links.zine.route), component: resolve(__dirname, 'routes/zine.vue') });
            }

            if (config.people.enabled) {
                routes.push({ path: '/' + encodeURIComponent(config.people.route), component: resolve(__dirname, 'routes/people.vue') });
            }

            if (config.english.enabled) {
                routes.push({ path: '/' + encodeURIComponent(config.english.route), component: resolve(__dirname, 'routes/english.vue') });
            }

            if (config.contact.enabled) {
                routes.push({ path: '/' + encodeURIComponent(config.contact.route), component: resolve(__dirname, 'routes/contact.vue') });
            }
            if (config.contact.team.enabled) {
                routes.push({ path: '/' + encodeURIComponent(config.contact.team.route), component: resolve(__dirname, 'routes/team.vue') });
            }

            if (config.census.enabled) {
                routes.push({ path: '/' + encodeURIComponent(config.census.route), component: resolve(__dirname, 'routes/census.vue') });
                routes.push({ path: '/' + encodeURIComponent(config.census.route) + '/admin', component: resolve(__dirname, 'routes/censusModeration.vue') });
            }

            if (config.user.enabled) {
                routes.push({path: '/' + encodeURIComponent(config.user.route), component: resolve(__dirname, 'routes/user.vue')});
                routes.push({path: '/' + encodeURIComponent(config.user.termsRoute), component: resolve(__dirname, 'routes/terms.vue')});
                routes.push({path: '/' + encodeURIComponent(config.user.privacyRoute), component: resolve(__dirname, 'routes/privacy.vue')});
            }
            routes.push({ path: '/license', component: resolve(__dirname, 'routes/license.vue') });

            routes.push({ path: '/admin', component: resolve(__dirname, 'routes/admin.vue') });

            routes.push({ path: '/admin/users', component: resolve(__dirname, 'routes/adminUsers.vue') });
            routes.push({ path: '/admin/profiles', component: resolve(__dirname, 'routes/adminProfiles.vue') });

            routes.push({ path: '/admin/timesheets', component: resolve(__dirname, 'routes/adminTimesheets.vue') });
            routes.push({ path: '/admin/timesheets/overview', component: resolve(__dirname, 'routes/adminTimesheetsOverview.vue') });

            routes.push({ path: '/admin/moderation', component: resolve(__dirname, 'routes/adminModeration.vue') });
            routes.push({ path: '/admin/abuse-reports', component: resolve(__dirname, 'routes/adminAbuseReports.vue') });
            routes.push({ path: '/admin/pending-bans', component: resolve(__dirname, 'routes/adminPendingBans.vue') });

            routes.push({ path: '/admin/translations/missing', component: resolve(__dirname, 'routes/adminTranslationsMissing.vue') });
            routes.push({ path: '/admin/translations/awaiting', component: resolve(__dirname, 'routes/adminTranslationsAwaiting.vue') });

            if (config.profile.enabled) {
                routes.push({path: '/u/*', component: resolve(__dirname, 'routes/profile.vue')});
                routes.push({path: '/@*', component: resolve(__dirname, 'routes/profile.vue')});
                routes.push({path: '/card/@*', component: resolve(__dirname, 'routes/profileCard.vue')});
                if (config.profile.editorEnabled) {
                    routes.push({path: '/editor', component: resolve(__dirname, 'routes/profileEditor.vue')});
                }
            }

            if (config.pronouns.enabled) {
                for (let prefix of [...(config.pronouns?.sentence?.prefixes || []), config.pronouns?.prefix || '']) {
                    routes.push({ path: `${prefix}/${encodeURIComponent(config.pronouns.any)}`, component: resolve(__dirname, 'routes/any.vue') });
                    routes.push({ path: `${prefix}/${encodeURIComponent(config.pronouns.any)}::group`, component: resolve(__dirname, 'routes/any.vue') });
                    if (config.pronouns.null && config.pronouns.null.routes) {
                        for (let route of config.pronouns.null.routes) {
                            routes.push({ path: `${prefix}/${encodeURIComponent(route)}`, component: resolve(__dirname, 'routes/avoiding.vue') });
                        }
                    }
                    if (config.pronouns.mirror) {
                        routes.push({ path: `${prefix}/${encodeURIComponent(config.pronouns.mirror.route)}`, component: resolve(__dirname, 'routes/mirror.vue') });
                    }
                }
            }

            if (config.calendar && config.calendar.enabled) {
                routes.push({ path: '/' + encodeURIComponent(config.calendar.route), component: resolve(__dirname, 'routes/calendar.vue') });
                routes.push({ path: '/' + encodeURIComponent(config.calendar.route) + '/:year(\\d\\d\\d\\d)', component: resolve(__dirname, 'routes/calendar.vue') });
                routes.push({ path: '/' + encodeURIComponent(config.calendar.route) + '/:year(\\d\\d\\d\\d)-:month(\\d\\d)-:day(\\d\\d)', component: resolve(__dirname, 'routes/calendarDay.vue') });
            }

            if (config.api !== null) {
                routes.push({ path: '/api', component: resolve(__dirname, 'routes/api.vue') });
            }

            routes.push({ name: 'all', path: `*`, component: resolve(__dirname, 'routes/pronoun.vue') });
        },
    },
}
