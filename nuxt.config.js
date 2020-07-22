/*
<meta property="og:type" content="article" />
<meta property="og:title" content="{{ title }}" />
<meta property="og:url" content="{{ app.request.uri }}" />
<meta property="og:image" content="{{ image }}" />
<meta property="og:logo" content="{{ app.request.uriForPath(asset('build/images/avatar-square.jpg')) }}" />
<meta property="og:site_name" content="{{ esse('main.title') }}" />

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{{ title }}">
<meta name="twitter:description" content="{{ description }}">
<meta name="twitter:image" content="{{ image }}">
<meta name="twitter:site" content="{{ esse('about/contact.data.twitter.niceUrl') }}" />
 */

const title = 'Zaimki.pl';
const description = 'To narzędzie udostępnia linki do przykładów użycia (w prostych zdaniach oraz w literaturze i prasie) zaimków i innych form płciowych – nie tylko normatywnych „on” i „ona”, lecz także form niebinarnych.';
const banner = process.env.BASE_URL + '/banner/zaimki.png';

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
            { hid: 'theme-color', name: 'theme-color', content: '#C71585' },

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
    ],
    components: true,
    buildModules: [],
    modules: [
        '@nuxtjs/pwa',
    ],
    build: {},
    env: {
      baseUrl: process.env.BASE_URL
    },
    serverMiddleware: {
        '/banner': '~/server/banner.js',
    },
}
