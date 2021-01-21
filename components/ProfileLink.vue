<template>
    <span>
        <img v-if="provider.icon.startsWith('https://')" :src="provider.icon" class="icon"/>
        <Icon v-else :v="provider.icon" :set="provider.iconSet || 'l'"/>
        <a :href="linkTrimmed" target="_blank" rel="noopener">
            {{provider.text}}
        </a>
    </span>
</template>

<script>
    import {clearUrl} from "../src/helpers";

    const LINK_PROVIDERS = {
        twitter: {
            regex: '^https?://(?:www.)?twitter.com/([^/]+)',
            icon: 'twitter',
            iconSet: 'b',
        },
        facebook: {
            regex: '^https?://(?:www.)?facebook.com/([^/]+)',
            icon: 'facebook',
            iconSet: 'b',
        },
        instagram: {
            regex: '^https?://(?:www.)?instagram.com/([^/]+)',
            icon: 'instagram',
            iconSet: 'b',
        },
        email: {
            regex: '^mailto:([^/]+)',
            icon: 'envelope',
        },
        reddit: {
            regex: '^https?://(?:www.)?reddit.com/u/([^/]+)',
            icon: 'reddit',
            iconSet: 'b',
        },
        telegram: {
            regex: '^https?://(?:www.)?t.me/([^/]+)',
            icon: 'telegram',
            iconSet: 'b',
        },
        paypal: {
            regex: '^https?://(?:www.)?paypal.me/([^/]+)',
            icon: 'paypal',
            iconSet: 'b',
        },
        cake: {
            regex: '^https://cake.avris.it/([bgoprc][A-E][0-6])$',
            icon: 'https://cake.avris.it/favicon.png',
        },
    };

    export default {
        props: {
            link: { required: true },
        },
        computed: {
            linkTrimmed() {
                return this.link.trim();
            },
            provider() {
                for (let name in LINK_PROVIDERS) {
                    if (!LINK_PROVIDERS.hasOwnProperty(name)) { continue; }
                    const provider = LINK_PROVIDERS[name];
                    const m = this.linkTrimmed.match(provider.regex);
                    if (m) {
                        return {
                            ...provider,
                            text: m[1],
                        };
                    }
                }

                return {
                    icon: 'globe-europe',
                    text: clearUrl(this.linkTrimmed),
                }
            },
        }
    };
</script>

<style lang="scss" scoped>
    .icon {
        height: 1em;
    }
</style>
