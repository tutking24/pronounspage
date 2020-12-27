<template>
    <header v-if="config.header" class="mb-4">
        <div class="mb-3 d-flex justify-content-between align-items-center flex-column flex-md-row">
            <h1 class="text-nowrap">
                <nuxt-link to="/">
                    <Icon v="tags"/>
                    <span class="higher"><T>title</T></span>
                </nuxt-link>
            </h1>
            <div v-if="config.locale === 'zh'" class="btn-group m-2">
                <button v-for="(display, code) in {traditional: '繁體', simplified: '简体'}"
                        :class="'btn btn-sm ' + (spelling === code ? 'btn-secondary disabled' : 'btn-outline-secondary')"
                        :disabled="spelling === code"
                        @click="setSpelling(code)"
                >
                    {{display}}
                </button>
            </div>
            <!--
            <Dropdown v-if="Object.keys(locales).length > 1" btnClass="btn-outline-secondary btn-sm">
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
            -->
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
        </div>
        <div class="d-block d-md-none">
            <div class="btn-group-vertical btn-block nav-custom mb-2">
                <nuxt-link v-for="link in links" :key="link.link" :to="link.link" :class="`btn btn-sm ${isActiveRoute(link) ? 'active' : ''}`">
                    <Icon :v="link.icon"/>
                    {{ link.textLong || link.text }}
                </nuxt-link>
            </div>
        </div>
        <div class="d-none d-md-block">
            <div class="btn-group btn-block nav-custom mb-2">
                <nuxt-link v-for="link in links" :key="link.link" :to="link.link" :class="`btn btn-sm ${isActiveRoute(link) ? 'active' : ''}`">
                    <Icon :v="link.icon" size="1.6"/>
                    <br/>
                    <span class="text-nowrap">{{ link.text }}</span>
                </nuxt-link>
            </div>
        </div>
        <div v-if="locales[config.locale].published === false" class="alert alert-warning">
            <Icon v="exclamation-triangle"/>
            This language version is still under construction!
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

    export default {
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
                    links.push({
                        link: '/' + this.config.nouns.route,
                        icon: 'book',
                        text: this.$t('nouns.header'),
                        textLong: this.$t('nouns.headerLong'),
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

    @include media-breakpoint-up('md', $grid-breakpoints) {
        .nav-custom {
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
    };

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
</style>
