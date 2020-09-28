<template>
    <header class="mb-4">
        <h1 class="mb-3">
            <nuxt-link to="/">
                <Icon v="tags"/>
                <T>title</T>
            </nuxt-link>
        </h1>
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
    import t from '../src/translator';

    export default {
        data() {
            const links = [];
            links.push({ link: '/', icon: 'home', text: t('home.header'), textLong: t('home.headerLong'), extra: ['all', this.config.template.any.route] });

            if (this.config.sources.enabled) {
                links.push({ link: '/' + this.config.sources.route, icon: 'books', text: t('sources.header'), textLong: t('sources.headerLong') });
            }

            if (this.config.nouns.enabled) {
                links.push({ link: '/' + this.config.nouns.route, icon: 'atom-alt', text: t('nouns.header'), textLong: t('nouns.headerLong') });
            }

            if (this.config.links.enabled) {
                links.push({ link: '/' + this.config.links.route, icon: 'bookmark', text: t('links.header'), textLong: t('links.headerLong') });
            }

            if (this.config.contact.enabled) {
                links.push({ link: '/' + this.config.contact.route, icon: 'comment-alt-smile', text: t('contact.header')});
            }

            return {
                links,
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
