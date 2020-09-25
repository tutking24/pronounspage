<template>
    <header class="mb-4">
        <h1 class="mb-3">
            <nuxt-link to="/">
                <Icon v="tags"/>
                Zaimki.pl
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
    export default {
        data() {
            return {
                links: [
                    { link: '/', icon: 'home', text: 'Zaimki', textLong: 'Lista zaimków', extra: ['all', 'dowolne'] },
                    { link: '/literatura', icon: 'books', text: 'Teksty kultury', textLong: 'Przykłady z tekstów kultury' },
                    { link: '/neutratywy', icon: 'atom-alt', text: 'Neutratywy', textLong: 'Słownik neutratywów' },
                    { link: '/linki', icon: 'bookmark', text: 'Materiały', textLong: 'Dodatkowe materiały' },
                    { link: '/kontakt', icon: 'comment-alt-smile', text: 'Kontakt' },
                ],
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
