<template>
    <div v-if="config.header" class="mb-lg-4">
        <header>
        <div class="d-none d-lg-flex justify-content-between align-items-center flex-row nav-custom btn-group mb-0">
            <nuxt-link v-for="link in links" :key="link.link" :to="link.link" :class="`nav-item btn btn-sm ${link.header ? 'nav-header' : ''} ${isActiveRoute(link) ? 'active' : ''} ${link.header ? 'flex-grow-0' : ''}`">
                <h1 v-if="link.header" class="text-nowrap">
                    <Logo flag/>
                    <span class="higher"><T>title</T></span>
                </h1>
                <template v-else>
                    <Icon :v="link.icon" size="1.6"/>
                    <br/>
                    <span class="text-nowrap"><Spelling :text="link.text"/></span>
                </template>
            </nuxt-link>
            <div class="nav-item flex-grow-0">
                <VersionDropdown end/>
            </div>
        </div>
        <div class="d-block-force d-lg-none p-4">
            <div class="text-center mb-3">
                <nuxt-link to="/">
                    <h1 class="text-nowrap">
                        <Logo flag class="me-2"/><span class="higher"><T>title</T></span>
                    </h1>
                </nuxt-link>
                <VersionDropdown/>
            </div>
            <div class="btn-group-vertical d-flex nav-custom mb-2">
                <nuxt-link v-for="link in links" :key="link.link" :to="link.link" :class="`btn btn-sm ${isActiveRoute(link) ? 'active' : ''}`">
                    <Icon :v="link.icon"/>
                    <Spelling :text="link.textLong || link.text"/>
                </nuxt-link>
            </div>
        </div>
        <div :class="['hamburger-menu']"  :style="`opacity: ${hamburgerShown ? 1 : 0}`">
            <button :class="['btn btn-outline-secondary btn-hamburger', hamburgerActive ? 'active' : '']"
                    @click.stop="hamburgerActive = !hamburgerActive"
            >
                <Icon v="bars"/>
            </button>
            <div :class="['bg border p-3 shadow', hamburgerActive ? '' : 'd-none']">
                <div class="btn-group-vertical d-flex nav-custom nav-custom-start mb-2">
                    <nuxt-link v-for="link in links" :key="link.link" :to="link.link" :class="`btn btn-sm ${isActiveRoute(link) ? 'active' : ''}`">
                        <Icon :v="link.icon"/>
                        <Spelling :text="link.textLong || link.text"/>
                    </nuxt-link>
                </div>
            </div>
        </div>
        </header>
        <div v-if="config.locale === 'zh' && new Date() < new Date(2022, 0, 1, 0, 0, 0) && $route.path === '/'" class="container">
            <div class="alert alert-info my-3">
                <p class="h4">
                    <Icon v="people-carry"/>
                    Help needed!
                </p>
                <p class="mb-0">
                    If you speak Mandarin
                    (preferably traditional spelling, since simplified can be generated out of it, but not the other way around)
                    and you'd like to help us with translating new features of zh.pronouns.page,
                    please send us an email to <a href="mailto:contact@pronouns.page" target="_blank" rel="noopener">contact@pronouns.page</a>
                    or DM us on Twitter <a href="https://twitter.com/PronounsPage" target="_blank" rel="noopener">@PronounsPage</a>
                    😉
                </p>
            </div>
        </div>
        <div v-if="config.locale === 'pl' && new Date() < new Date(2022, 3, 12, 19, 0, 0) && $route.path === '/'" class="container">
            <div class="alert alert-info my-3">
                <p>
                    <Icon v="calendar"/>
                    We <strong>wtorek, 12 kwietnia, o 18:00</strong>
                    Sybil i Andrea będą gościć w Katedrze Performatyki Uniwersytetu Jagiellońskiego
                    w rozmowie „W stronę niebinarności. Nowe relacje w języku”.
                    Zapraszamy do oglądania lajwa!
                </p>
                <p class="mb-0 text-center">
                    <a href="https://www.facebook.com/events/711884409825918" target="_blank" rel="noopener" class="btn btn-primary">
                        <Icon v="play"/>
                        Live/event
                    </a>
                </p>
            </div>
        </div>
        <div v-if="config.locale === 'en' && new Date() < new Date(2023, 4, 9, 0, 0, 0) && $route.path === '/'" class="container">
            <div class="alert alert-light shadow my-3">
                <p class="h4">
                    <Icon v="chart-pie"/>
                    Take part in the Gender Census 2023!
                </p>
                <p>
                    Our friend who's running the annual international Gender Census
                    is currently collecting answers in the 10th edition of the survey!
                    It's open until 9th May 2023.
                    It's for anyone whose gender (or lack thereof) isn't described by the M/F binary.
                    It's short and easy, and results are useful in academia, business and self-advocacy.
                </p>
                <p class="mb-0">
                    <a href="https://survey.gendercensus.com" target="_blank" rel="noopener" class="btn btn-primary">
                        <Icon v="arrow-alt-right"/>
                        survey.gendercensus.com
                    </a>
                </p>
            </div>
        </div>
        <div v-if="locales[config.locale].published === false" class="alert alert-warning mb-0 mx-5 text-center">
            <Icon v="exclamation-triangle"/>
            This language version is still under construction!
        </div>
        <div v-show="showCensus" class="container position-relative">
            <nuxt-link :to="`/${config.census.route}`">
                <img src="/img-local/census/census-banner-horizontal.png"
                     alt="Na tle flagi osób niebinarnych (cztery poziome pasy: żółty, biały, fioletowy, czarny) tekst: Trwa trzecia edycja największego badania języka osób niebinarnych! Jakich form używamy? Jak unikamy upłciowionego języka? Jak nasz język rozwija się i zmienia? Wypełnij naszą ankietę, by pomóc nam to zbadać! Niebinarny Spis Powszechny 2023; zaimki.pl/spis"
                     class="w-100 shadow d-none d-md-block"/>
                <img src="/img-local/census/census-banner-horizontal-mobile.png"
                     alt="Na tle flagi osób niebinarnych (cztery poziome pasy: żółty, biały, fioletowy, czarny) tekst: Trwa trzecia edycja największego badania języka osób niebinarnych! Jakich form używamy? Jak unikamy upłciowionego języka? Jak nasz język rozwija się i zmienia? Wypełnij naszą ankietę, by pomóc nam to zbadać! Niebinarny Spis Powszechny 2023; zaimki.pl/spis"
                     class="w-100 shadow d-md-none"/>
            </nuxt-link>
            <a href="#"
               class="position-absolute p-2 bg-primary text-white btn-dismiss"
               @click.prevent="dismissCensus">
                <Icon v="times"/>
            </a>
        </div>
        <div v-if="config.locale === 'pl' && new Date() < new Date(2023, 4, 1, 0, 0, 0) && ['/', '/spis'].includes($route.path)" class="container position-relative">
            <nuxt-link to="/blog/spis-2023">
                <img src="/img-local/census/census-banner-report-horizontal.png"
                     alt="Na tle flagi osób niebinarnych (cztery poziome pasy: żółty, biały, fioletowy, czarny) tekst: Przedstawiamy raport z trzeciej edycji największego badania języka osób niebinarnych! Niebinarny Spis Powszechny 2023; zaimki.pl/spis"
                     class="w-100 shadow d-none d-md-block"/>
                <img src="/img-local/census/census-banner-report-horizontal-mobile.png"
                     alt="Na tle flagi osób niebinarnych (cztery poziome pasy: żółty, biały, fioletowy, czarny) tekst: Niebinarny Spis Powszechny 2023; Przeczytaj raport z badania! zaimki.pl/spis"
                     class="w-100 shadow d-md-none"/>
            </nuxt-link>
        </div>
        <div v-if="$user() && $user().bannedReason" class="alert alert-danger mb-0 container">
            <p class="h4 mb-2">
                <Icon v="ban"/>
                <T>ban.header</T>
            </p>
            <p >
                <T>ban.reason</T><T>quotation.colon</T>
                {{$user().bannedReason}}
            </p>
            <p>
                <T>ban.termsIntro</T><T>quotation.colon</T>
            </p>
            <blockquote class="small">
                <T>terms.content.content.violations</T>
                <template v-for="(violation, i) in forbidden"><T :class="[$user().bannedTerms.includes(violation) ? 'fw-bold' : '']">terms.content.content.violationsExamples.{{violation}}</T><template v-if="i !== forbidden.length - 1">, </template></template>.
            </blockquote>
        </div>
    </div>
    <header v-else class="mb-4">
        <div class="container">
            <h1 class="text-nowrap p-4 mb-0">
                <nuxt-link to="/">
                    <Logo flag class="me-2"/><span class="higher"><T>title</T></span>
                </nuxt-link>
            </h1>
        </div>
    </header>
</template>

<script>
    import { mapState } from 'vuex'
    import {DateTime} from "luxon";
    import forbidden from "../src/forbidden";

    export default {
        data() {
            return {
                hamburgerActive: false,
                hamburgerShown: false,
                censusDismissed: false,
                forbidden,
            };
        },
        computed: {
            ...mapState([
                'user',
                'darkMode',
            ]),
            links() {
                const links = [];

                links.push({
                    header: true,
                    link: '/',
                    icon: 'home',
                    text: this.$t('home.header'),
                    textLong: this.$t('home.link'),
                });

                if (this.config.pronouns.enabled) {
                    const extra = ['all'];
                    for (let prefix of [...(this.config.pronouns.sentence ? this.config.pronouns.sentence.prefixes : []), '']) {
                        extra.push(`${prefix}/${this.config.pronouns.any}`);
                        extra.push(`${prefix}/${this.config.pronouns.any}:`);
                        if (this.config.pronouns.null && this.config.pronouns.null.routes) {
                            for (let route of this.config.pronouns.null.routes) {
                                extra.push(`${prefix}/${route}`);
                            }
                        }
                        if (this.config.pronouns.mirror) {
                            extra.push(`${prefix}/${this.config.pronouns.mirror.route}`);
                        }
                    }
                    links.push({
                        link: '/' + this.config.pronouns.route,
                        icon: 'tags',
                        text: this.$t('pronouns.header'),
                        textLong: this.$t('pronouns.headerLong').replace( /(<([^>]+)>)/ig, ''),
                        extra: extra,
                    });
                }

                if (this.config.nouns.enabled) {
                    const extras = [];
                    for (let subroute of this.config.nouns.subroutes || []) {
                        extras.push(`/${subroute}`);
                    }
                    links.push({
                        link: '/' + this.config.nouns.route,
                        icon: 'book',
                        text: this.$t('nouns.header'),
                        textLong: this.$t('nouns.headerLong'),
                        extra: extras,
                    });
                }

                if (this.config.sources.enabled) {
                    links.push({
                        link: '/' + this.config.sources.route,
                        icon: 'books',
                        text: this.$t('sources.header'),
                        textLong: this.$t('sources.headerLong'),
                    });
                }

                if (this.config.faq.enabled && !this.config.links.split) {
                    links.push({
                        link: '/' + this.config.faq.route,
                        icon: 'map-marker-question',
                        text: this.$t('faq.header'),
                        textLong: this.$t('faq.headerLong'),
                    });
                }

                if (this.config.links.enabled) {
                    links.push({
                        link: '/' + this.config.links.route,
                        icon: 'bookmark',
                        text: this.$t('links.header'),
                        textLong: this.$t('links.headerLong'),
                        extra: [
                            '/' + this.config.links.academicRoute,
                            'blog',
                            'blogEntry',
                            'blogEntryShortcut',
                            '/' + this.config.links.mediaRoute,
                            this.config.links.split ? '/' + this.config.faq.route : '',
                            this.config.english && this.config.english.enabled ? '/' + this.config.english.route : '',
                            this.config.links.zine && this.config.links.zine.enabled ? '/' + this.config.links.zine.route : '',
                        ],
                    });
                }

                if ((this.config.terminology.enabled && this.config.terminology.published)
                    || (this.config.calendar && this.config.calendar.enabled)
                    || (this.config.census && this.config.census.enabled)
                    || (this.config.inclusive && this.config.inclusive.enabled)
                    || (this.config.people && this.config.people.enabled)
                    || (this.config.contact && this.config.contact.team && this.config.contact.team.enabled)
                ) {
                    const extra = [
                        this.config.terminology && this.config.terminology.enabled ? '/' + this.config.terminology.route : '',
                        this.config.calendar && this.config.calendar.enabled ? '/' + this.config.calendar.route : '',
                        this.config.census && this.config.census.enabled ? '/' + this.config.census.route : '',
                        this.config.inclusive && this.config.inclusive.enabled ? '/' + this.config.inclusive.route : '',
                        this.config.names && this.config.names.enabled && this.config.names.published ? '/' + this.config.names.route : '',
                        this.config.people && this.config.people.enabled ? '/' + this.config.people.route : '',
                        '/' + this.config.contact.team.route,
                    ];

                    if (this.config.community) {
                        links.push({
                            link: '/' + this.config.community.route,
                            icon: 'users',
                            text: this.$t('community.header'),
                            textLong: this.$t('community.headerLong'),
                            extra: extra,
                        });
                    } else if (this.config.calendar && this.config.calendar.enabled) {
                        links.push({
                            link: '/' + this.config.calendar.route,
                            icon: 'calendar-star',
                            text: this.$t('calendar.header'),
                            textLong: this.$t('calendar.headerLong'),
                            extra: extra,
                        });
                    }
                }

                if (this.config.contact.enabled) {
                    links.push({
                        link: '/' + this.config.contact.route,
                        icon: 'comment-alt-smile',
                        text: this.$t('contact.header'),
                    });
                }

                if (this.config.user.enabled) {
                    links.push({
                        link: '/' + this.config.user.route,
                        icon: 'user',
                        text: this.user ? '@' + this.user.username : this.$t('user.header'),
                        textLong: this.user ? '@' + this.user.username : this.$t('user.headerLong'),
                        extra: ['/editor', this.$user() ? '/@' + this.$user().username : null],
                    });
                    if (this.$isGranted('panel')) {
                        links.push({
                            link: '/admin',
                            icon: 'user-cog',
                            text: this.$t('admin.header'),
                            textLong: this.$t('admin.header'),
                            extra: [
                                '/admin/users',
                                '/admin/profiles',
                                '/admin/timesheets',
                                '/admin/moderation',
                                '/admin/abuse-reports',
                                '/admin/pending-bans',
                                '/admin/translations/missing',
                                '/admin/translations/awaiting',
                            ],
                        });
                    }
                }

                return links;
            },
            showCensus() {
                if (!process.client) {
                    return false;
                }
                const finished = !!parseInt(window.localStorage.getItem(`census-${this.config.census.edition}-finished`) || 0);
                const dismissed = !!parseInt(window.localStorage.getItem(`census-${this.config.census.edition}-dismissed`) || 0);
                const alreadyIn = this.$route.path === '/' + this.config.census.route;
                const isHomepage = this.$route.path === '/';
                if (!this.config.census.enabled || (!isHomepage && (finished || dismissed)) || this.censusDismissed || alreadyIn) {
                    return false;
                }
                const start = DateTime.fromISO(this.config.census.start).toLocal();
                const end = DateTime.fromISO(this.config.census.end).toLocal();
                const now = DateTime.utc().setZone(this.config.format.timezone);
                return now >= start && now <= end;
            },
        },
        methods: {
            isActiveRoute(link) {
                return decodeURIComponent(this.$route.path) === link.link
                    || (link.extra && this.$route.name && link.extra.includes(this.$route.name.split(':')[0]))
                    || (link.extra || []).includes(decodeURIComponent(this.$route.path))
                    || (link.extra || []).filter(x => x && (
                        decodeURIComponent(this.$route.path).startsWith(x + '/')
                        || decodeURIComponent(this.$route.path).startsWith(x + ':'))
                    ).length;
            },
            documentClicked() {
                if (this.hamburgerActive) {
                    this.hamburgerActive = false
                }
            },
            updateShown() {
                const st = document.body.scrollTop || document.querySelector('html').scrollTop;
                this.hamburgerShown = st > 300;
            },
            dismissCensus() {
                window.localStorage.setItem(`census-${this.config.census.edition}-dismissed`, '1');
                this.censusDismissed = true;
            }
        },
        created() {
            if (process.client) {
                document.addEventListener('click', this.documentClicked);
                this.updateShown();
                window.addEventListener('scroll', this.updateShown);
            }
        },
        destroyed() {
            if (process.client) {
                document.removeEventListener('click', this.documentClicked);
                document.removeEventListener('scroll', this.updateShown);
            }
        },
    }
</script>

<style lang="scss" scoped>
    @import "assets/variables";

    header {
        padding: 0;
        width: 100%;
    }

    @include media-breakpoint-down('lg', $grid-breakpoints) {
        h1 {
            font-size: 2rem;
        }

        .nav-custom {
            .btn {
                border: none;
                border-inline-start: 1px solid $gray-500;
                border-radius: 0;

                &:hover, &:focus, &.active {
                    border-inline-start: 3px solid $primary;
                    padding-inline-start: calc(#{$btn-padding-x-sm} - 2px);
                    color: $primary;
                }

                text-align: left;
            }
        }

        .hamburger-menu {
            position: fixed;
            top: $spacer;
            left: $spacer;
            z-index: 1030;
            transition: all .5s ease-in-out;
            .bg {
                background-color: rgba($white, .9)
            }
            .btn-hamburger {
                &:not(:active):not(:hover):not(:focus):not(.active) {
                    background-color: $white;
                }
                &.active {
                    background-color: $secondary;
                }
            }
        }
    }

    .nav-custom-start {
        .btn {
            border: none;
            border-inline-start: 1px solid $gray-500;
            border-radius: 0;

            &:hover, &:focus, &.active {
                border-inline-start: 3px solid $primary;
                padding-inline-start: calc(#{$btn-padding-x-sm} - 2px);
                color: $primary;
            }

            text-align: left;
        }
    }

    @include media-breakpoint-up('lg', $grid-breakpoints) {
        header {
            position: fixed;
            z-index: 99;
            top: 0;
            left: 0;
            background-color: rgba($white, .9);
            box-shadow: $box-shadow;
        }

        .nav-custom:not(.nav-custom-start) {
            .nav-item {
                border: none;
                border-bottom: 1px solid $gray-500;
                border-radius: 0;

                &.btn {
                    &:hover, &:focus, &.active {
                        border-bottom: 3px solid $primary;
                        padding-bottom: calc(#{$btn-padding-y-sm} - 2px);
                        color: $primary;
                    }
                }

                height: $header-height;
                padding-top: 1.2rem;
                &.nav-header {
                    padding-top: 0.6rem;
                }
                margin-top: 3px;

                &:first-child, &:last-child {
                    padding-left: 1rem;
                    padding-right: 1rem;
                }
            }
        }

        .hamburger-menu {
            display: none;
        }
    }

    h1 {
        text-decoration: none;
        margin-bottom: .5em;
        .higher {
            position: relative;
            top: -0.1em;
        }
    }

    .btn-dismiss {
        top: 0;
        right: 0;
        opacity: 0.5;
        transition: opacity .25s ease-in-out;
        &:hover {
            opacity: 1;
        }
    }
</style>
