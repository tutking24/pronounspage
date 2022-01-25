<template>
    <div v-if="config.header" class="mb-4">
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
        <div class="d-block d-lg-none p-4">
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
            <div :class="['bg-white border p-3', hamburgerActive ? '' : 'd-none']">
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
        <div v-if="config.locale === 'pl' && new Date() < new Date(2022, 0, 1, 0, 0, 0) && $route.path === '/'" class="container">
            <div class="alert alert-info my-3">
                <p class="h3">
                    <Icon v="zine.svg" :inverse="darkMode"/>
                    <T>links.zine.headerLong</T>
                </p>
                <p>
                    Do końca grudnia zbieramy zgłoszenia tekstów i grafik do niebinarnego zina!
                </p>
                <p class="mb-0">
                    <nuxt-link to="/zin" class="btn btn-primary">
                        <Icon v="info-circle"/>
                        Więcej info
                    </nuxt-link>
                </p>
            </div>
        </div>
        <div v-if="locales[config.locale].published === false" class="alert alert-warning mb-0 mx-5 text-center">
            <Icon v="exclamation-triangle"/>
            This language version is still under construction!
        </div>
        <div v-show="showCensus" class="container">
            <div class="alert alert-info mb-0">
                <a href="#" class="float-end" @click.prevent="dismissCensus">
                    <Icon v="times"/>
                </a>
                <Icon v="user-chart" size="2" class="d-inline-block float-start me-3 mt-2"/>
                <T silent>census.banner</T>
            </div>
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
                    const extra = ['all', '/' + this.config.pronouns.any, `/${this.config.pronouns.any}:`]
                    if (this.config.pronouns.null && this.config.pronouns.null.routes) {
                        for (let route of this.config.pronouns.null.routes) {
                            extra.push('/' + route);
                        }
                    }
                    if (this.config.pronouns.mirror) {
                        extra.push('/' + this.config.pronouns.mirror.route)
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

                if (this.config.names && this.config.names.enabled && this.config.names.published) {
                    links.push({
                        link: '/' + this.config.names.route,
                        icon: 'signature',
                        text: this.$t('names.header'),
                        textLong: this.$t('names.headerLong'),
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
                ) {
                    const extra = [
                        this.config.terminology && this.config.terminology.enabled ? '/' + this.config.terminology.route : '',
                        this.config.calendar && this.config.calendar.enabled ? '/' + this.config.calendar.route : '',
                        this.config.census && this.config.census.enabled ? '/' + this.config.census.route : '',
                        this.config.inclusive && this.config.inclusive.enabled ? '/' + this.config.inclusive.route : '',
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
                }

                return links;
            },
            showCensus() {
                if (!process.client) {
                    return false;
                }
                const finished = !!parseInt(window.localStorage.getItem('census-finished') || 0);
                const dismissed = !!parseInt(window.localStorage.getItem('census-dismissed') || 0);
                const alreadyIn = this.$route.path === '/' + this.config.census.route;
                if (!this.config.census.enabled || finished || dismissed || this.censusDismissed || alreadyIn) {
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
                window.localStorage.setItem('census-dismissed', '1');
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
            z-index: 9999;
            top: 0;
            left: 0;
            backdrop-filter: blur(12px);
            @supports not (backdrop-filter: blur(12px)) {
                background-color: $white;
            }
            box-shadow: $box-shadow;
        }

        .nav-custom:not(.nav-custom-start) {
            .nav-item {
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
</style>
