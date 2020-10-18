<template>
    <span>
        <img v-if="icon.startsWith('https://')" :src="icon" class="icon"/>
        <Icon v-else :v="icon" :set="iconSet"/>
        <a :href="link" target="_blank" rel="noopener">
            {{text}}
        </a>
    </span>
</template>

<script>
    import {clearUrl} from "../src/helpers";

    const REGEX_TWITTER = '^https://twitter.com/([^/]+)';
    const REGEX_CAKE = '^https://cake.avris.it/([bgoprc][A-E][0-6])$';

    export default {
        props: {
            link: { required: true },
        },
        computed: {
            type() {
                if (this.link.match(REGEX_TWITTER)) {
                    return 'twitter';
                }

                if (this.link.match(REGEX_CAKE)) {
                    return 'cake';
                }

                return 'other';
            },
            icon() {
                return {
                    twitter: 'twitter',
                    cake: 'https://cake.avris.it/favicon.png',
                    other: 'globe-europe',
                }[this.type];
            },
            iconSet() {
                return {
                    twitter: 'b',
                }[this.type] || 'l';
            },
            text() {
                if (this.type === 'twitter') {
                    return this.link.match(REGEX_TWITTER)[1];
                }

                if (this.type === 'cake') {
                    return this.link.match(REGEX_CAKE)[1];
                }

                return clearUrl(this.link);
            },
        }
    };
</script>

<style lang="scss" scoped>
    .icon {
        height: 1em;
    }
</style>
