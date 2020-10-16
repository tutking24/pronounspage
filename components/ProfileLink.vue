<template>
    <span>
        <Icon :v="icon" :set="iconSet"/>
        <a :href="link" target="_blank" rel="noopener">
            {{text}}
        </a>
    </span>
</template>

<script>
    import {clearUrl} from "../src/helpers";

    const REGEX_TWITTER = '^https://twitter.com/([^/]+)';

    export default {
        props: {
            link: { required: true },
        },
        computed: {
            type() {
                if (this.link.match(REGEX_TWITTER)) {
                    return 'twitter';
                }

                return 'other';
            },
            icon() {
                return {
                    twitter: 'twitter',
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

                return clearUrl(this.link);
            },
        }
    };
</script>
