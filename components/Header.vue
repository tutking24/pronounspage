<template>
    <div v-if="config.header" class="mb-4">
        <header>
        <div class="d-none d-lg-flex justify-content-between align-items-center flex-row nav-custom btn-group mb-0">
            <nuxt-link v-for="link in links" :key="link.link" :to="link.link" :class="`nav-item btn btn-sm ${isActiveRoute(link) ? 'active' : ''} ${link.header ? 'flex-grow-0' : ''}`">
                <h1 v-if="link.header" class="text-nowrap">
                    <Icon v="tags"/>
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
        <div class="d-block d-lg-none">
            <div class="text-center mb-3">
                <nuxt-link to="/">
                    <h1 class="text-nowrap">
                        <Icon v="tags"/>
                        <span class="higher"><T>title</T></span>
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
        <div v-if="locales[config.locale].published === false" class="alert alert-warning mb-0">
            <Icon v="exclamation-triangle"/>
            This language version is still under construction!
        </div>
        <div v-show="showCensus" class="alert alert-info mb-0">
            <a href="#" class="float-end" @click.prevent="dismissCensus">
                <Icon v="times"/>
            </a>
            <Icon v="user-chart" size="2" class="d-inline-block float-start me-3 mt-2"/>
            <T silent>census.banner</T>
        </div>
        <div v-if="$user() && $user().bannedReason" class="alert alert-danger mb-0 container">
            <p class="h4 mb-2">
                <Icon v="ban"/>
                <T>ban.header</T>
            </p>
            <p >
                <T>ban.reason</T>:
                {{$user().bannedReason}}
            </p>
            <p>
                <T>ban.termsIntro</T>
            </p>
            <blockquote class="small">
                It is forbidden to post on the Service any Content that might break the law or violate social norms,
                including but not limited to:
                propagation of totalitarian regimes, hate speech, racism, xenophobia, homophobia, transphobia, queerphobia,
                misogyny, harassment, impersonation, child pornography, unlawful conduct, misinformation,
                sharing of someone else's personal data, spam, advertisement, copyright or trademark violations.
            </blockquote>
        </div>
    </div>
    <header v-else class="mb-4">
        <h1 class="text-nowrap">
            <nuxt-link to="/">
                <Icon v="tags"/>
                <T>title</T>
            </nuxt-link>
        </h1>
    </header>
</template>

<script>
    import { mapState } from 'vuex'
    import {DateTime} from "luxon";

    export default {
        data() {
            return {
                hamburgerActive: false,
                hamburgerShown: false,
                censusDismissed: false,
            };
        },
        computed: {
            ...mapState([
                'user',
            ]),
            links() {
                const links = [];

                links.push({
                    header: true,
                    link: '/',
                    icon: 'home',
                    text: this.$t('home.header'),
                    textLong: this.$t('home.headerLong'),
                    extra: ['all', '/' + this.config.pronouns.any, this.config.pronouns.avoiding ? '/' + this.config.pronouns.avoiding : null ],
                });

                if (this.config.sources.enabled) {
                    links.push({
                        link: '/' + this.config.sources.route,
                        icon: 'books',
                        text: this.$t('sources.header'),
                        textLong: this.$t('sources.headerLong'),
                    });
                }

                if (this.config.nouns.enabled) {
                    const extras = [];
                    for (let subroute of this.config.nouns.subroutes || []) {
                        extras.push(`/${this.config.nouns.route}/${subroute}`);
                    }
                    if (this.config.nouns.inclusive.enabled) {
                        extras.push(`/${this.config.nouns.route}/${this.config.nouns.inclusive.route}`);
                    }
                    if (this.config.nouns.terms.enabled) {
                        extras.push(`/${this.config.nouns.route}/${this.config.nouns.terms.route}`);
                    }

                    links.push({
                        link: '/' + this.config.nouns.route,
                        icon: 'book',
                        text: this.$t('nouns.header'),
                        textLong: this.$t('nouns.headerLong'),
                        extra: extras,
                    });
                }

                if (this.config.names.enabled) {
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
                            '/' + this.config.links.mediaRoute,
                            this.config.links.split ? '/' + this.config.faq.route : '',
                            '/' + this.config.people.route,
                        ],
                    });
                }

                if (this.config.english.enabled) {
                    links.push({
                        link: '/' + this.config.english.route,
                        icon: 'globe-americas',
                        text: this.$t('english.header'),
                        textLong: this.$t('english.headerLong'),
                    });
                }

                if (this.config.census.enabled) {
                    links.push({
                        link: '/' + this.config.census.route,
                        icon: 'user-chart',
                        text: this.$t('census.header'),
                        textLong: this.$t('census.headerLong'),
                    });
                }

                if (this.config.contact.enabled) {
                    links.push({
                        link: '/' + this.config.contact.route,
                        icon: 'comment-alt-smile',
                        text: this.$t('contact.header'),
                        extra: ['/' + this.config.contact.team.route],
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
                    || (link.extra || []).includes(this.$route.name)
                    || (link.extra || []).includes(decodeURIComponent(this.$route.path));
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
        .higher {
            position: relative;
            top: -0.1em;
        }
    }
</style>
