<template>
    <header class="mb-4">
        <div class="mb-3 d-flex justify-content-between align-items-center flex-column flex-md-row">
            <h1 class="text-nowrap">
                <nuxt-link to="/">
                    <Icon v="tags"/>
                    <T>title</T>
                </nuxt-link>
            </h1>
            <ul class="list-inline small mb-0" v-if="config.localeSwitch">
                <li v-for="(options, locale) in locales" :key="locale" class="list-inline-item">
                    <strong v-if="locale === config.locale">
                        {{options.name}}
                    </strong>
                    <a v-else :href="options.url">
                        {{options.name}}
                    </a>
                </li>
            </ul>
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
    </header>
</template>

<script>
    import { locales } from '../src/data';

    export default {
        data() {
            const links = [];
            links.push({ link: '/', icon: 'home', text: this.$t('home.header'), textLong: this.$t('home.headerLong'), extra: ['all', this.config.template.any.route] });

            if (this.config.sources.enabled) {
                links.push({ link: '/' + this.config.sources.route, icon: 'books', text: this.$t('sources.header'), textLong: this.$t('sources.headerLong') });
            }

            if (this.config.nouns.enabled) {
                links.push({ link: '/' + this.config.nouns.route, icon: 'atom-alt', text: this.$t('nouns.header'), textLong: this.$t('nouns.headerLong') });
            }

            if (this.config.names.enabled) {
                links.push({ link: '/' + this.config.names.route, icon: 'signature', text: this.$t('names.header'), textLong: this.$t('names.headerLong') });
            }

            if (this.config.links.enabled) {
                links.push({ link: '/' + this.config.links.route, icon: 'bookmark', text: this.$t('links.header'), textLong: this.$t('links.headerLong') });
            }

            if (this.config.english.enabled) {
                links.push({ link: '/' + this.config.english.route, icon: 'globe-americas', text: this.$t('english.header'), textLong: this.$t('english.headerLong') });
            }

            if (this.config.contact.enabled) {
                links.push({ link: '/' + this.config.contact.route, icon: 'comment-alt-smile', text: this.$t('contact.header')});
            }

            return {
                links,
                locales,
            };
        },
        methods: {
            isActiveRoute(link) {
                return this.$route.path === link.link || (link.extra || []).includes(this.$route.name);
            },
        },
    }
</script>

<style lang="scss" scoped>
    @import "assets/style";

    @include media-breakpoint-down('sm', $grid-breakpoints) {
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
</style>
