<template>
    <header v-if="config.header" class="mb-4">
        <div class="mb-3 d-flex justify-content-between align-items-center flex-column flex-md-row">
            <h1 class="text-nowrap">
                <nuxt-link to="/">
                    <Icon v="tags"/>
                    <span class="higher"><T>title</T></span>
                </nuxt-link>
            </h1>
            <div>
                <div v-if="config.locale === 'zh'" class="btn-group m-2">
                    <button v-for="(display, code) in {traditional: '繁體', simplified: '简体'}"
                            :class="'btn btn-sm ' + (spelling === code ? 'btn-secondary disabled' : 'btn-outline-secondary')"
                            :disabled="spelling === code"
                            @click="setSpelling(code)"
                    >
                        {{display}}
                    </button>
                </div>
                <Dropdown v-if="Object.keys(locales).length > 1" btnClass="btn-outline-secondary btn-sm" class="d-inline-block">
                    <template v-slot:toggle>
                        <Icon v="language"/>
                        {{locales[config.locale].name}}
                    </template>

                    <template v-slot:menu>
                        <li v-for="(options, locale) in locales" :key="locale" v-if="locale !== config.locale">
                            <a :href="options.url" class="dropdown-item">
                                {{options.name}}
                            </a>
                        </li>
                        <li class="dropdown-divider"></li>
                        <li>
                            <LocaleLink locale="en" link="/blog/creating-new-language-version" class="dropdown-item small">
                                <Icon v="plus"/>
                                <T>localise.shorter</T>
                            </LocaleLink>
                        </li>
                    </template>
                </Dropdown>
                <!--
                <div class="btn-group">
                    <a v-for="(options, locale) in locales" :key="locale"
                       :href="options.url"
                       :class="'btn btn-sm ' + (locale === config.locale ? 'btn-secondary disabled' : 'btn-outline-secondary')"
                       :disabled="locale === config.locale"
                    >
                        {{options.name}}
                    </a>
                    <LocaleLink locale="en" link="/blog/creating-new-language-version" class="btn btn-sm btn-outline-secondary">
                        <Icon v="plus"/>
                    </LocaleLink>
                </div>
                -->
            </div>
        </div>
        <div class="d-block d-md-none">
            <div class="btn-group-vertical btn-block nav-custom mb-2">
                <nuxt-link v-for="link in links" :key="link.link" :to="link.link" :class="`btn btn-sm ${isActiveRoute(link) ? 'active' : ''}`">
                    <Icon :v="link.icon"/>
                    <Spelling>{{ link.textLong || link.text }}</Spelling>
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
                <div class="btn-group-vertical btn-block nav-custom nav-custom-left mb-2">
                    <nuxt-link v-for="link in links" :key="link.link" :to="link.link" :class="`btn btn-sm ${isActiveRoute(link) ? 'active' : ''}`">
                        <Icon :v="link.icon"/>
                        <Spelling>{{ link.textLong || link.text }}</Spelling>
                    </nuxt-link>
                </div>
            </div>
        </div>
        <div class="d-none d-md-block">
            <div class="btn-group btn-block nav-custom mb-2">
                <nuxt-link v-for="link in links" :key="link.link" :to="link.link" :class="`btn btn-sm ${isActiveRoute(link) ? 'active' : ''}`">
                    <Icon :v="link.icon" size="1.6"/>
                    <br/>
                    <span class="text-nowrap"><Spelling>{{ link.text }}</Spelling></span>
                </nuxt-link>
            </div>
        </div>
        <div v-if="locales[config.locale].published === false" class="alert alert-warning mt-3">
            <Icon v="exclamation-triangle"/>
            This language version is still under construction!
        </div>
        <div v-show="showCensus" class="alert alert-info mt-3">
            <a href="#" class="float-right" @click.prevent="dismissCensus">
                <Icon v="times"/>
            </a>
            <Icon v="user-chart" size="2" class="d-inline-block float-left mr-3 mt-2"/>
            <T silent>census.banner</T>
        </div>
    </header>
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
                'spelling',
            ]),
            links() {
                const links = [];

                links.push({
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

                if (this.config.faq.enabled) {
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
                    });
                }

                if (this.config.people.enabled) {
                    links.push({
                        link: '/' + this.config.people.route,
                        icon: 'user-friends',
                        text: this.$t('people.header'),
                        textLong: this.$t('people.headerLong'),
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
            setSpelling(spelling) {
                this.$store.commit('setSpelling', spelling);
                this.$cookies.set('spelling', this.$store.state.spelling);
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

    @include media-breakpoint-down('sm', $grid-breakpoints) {
        h1 {
            font-size: 2rem;
        }

        .nav-custom {
            .btn {
                border-left: 1px solid $gray-500;
                border-radius: 0;

                &:hover, &:focus, &.active {
                    border-left: 3px solid $primary;
                    padding-left: calc(#{$btn-padding-x-sm} - 2px);
                    color: $primary;
                }

                text-align: left;
            }
        }
    }

    .nav-custom-left {
        .btn {
            border-left: 1px solid $gray-500;
            border-radius: 0;

            &:hover, &:focus, &.active {
                border-left: 3px solid $primary;
                padding-left: calc(#{$btn-padding-x-sm} - 2px);
                color: $primary;
            }

            text-align: left;
        }
    }

    @include media-breakpoint-up('md', $grid-breakpoints) {
        .nav-custom:not(.nav-custom-left) {
            .btn {
                border-bottom: 1px solid $gray-500;
                border-radius: 0;

                &:hover, &:focus, &.active {
                    border-bottom: 3px solid $primary;
                    padding-bottom: calc(#{$btn-padding-y-sm} - 2px);
                    color: $primary;
                }
            }
        }
    }

    h1 {
        a {
            text-decoration: none;
            .higher {
                position: relative;
                top: -0.1em;
            }
            &:hover .higher {
                text-decoration: underline;
            }
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
</style>
