<template>
    <div class="shareon">
        <a v-for="network in networks" :href="link(network)" target="_blank" rel="noopener" :class="network"></a>
    </div>
</template>

<script>
    // adapted from https://shareon.js.org (MIT)
    // can't use from yarn, because window.onload conflicts with SSR

    const NETWORKS = {
        facebook: function (d) { return "https://www.facebook.com/sharer/sharer.php?u=" + d.url; },
        linkedin: function (d) { return "https://www.linkedin.com/shareArticle?mini=true&url=" + d.url + "&title=" + d.title; },
        messenger: function (d) { return "https://www.facebook.com/dialog/send?app_id=3619024578167617&link=" + d.url + "&redirect_uri=" + d.url; },
        odnoklassniki: function (d) { return "https://connect.ok.ru/offer?url=" + d.url + "&title=" + d.title + (d.extra.media ? "&imageUrl=" + d.extra.media : ''); },
        pinterest: function (d) { return "https://pinterest.com/pin/create/button/?url=" + d.url + "&description=" + d.title + (d.extra.media ? "&media=" + d.extra.media : ''); },
        pocket: function (d) { return "https://getpocket.com/edit.php?url=" + d.url; },
        reddit: function (d) { return "https://www.reddit.com/submit?title=" + d.title + "&url=" + d.url; },
        telegram: function (d) { return "https://telegram.me/share/url?url=" + d.url + (d.extra.text ? "&text=" + d.extra.text : ''); },
        twitter: function (d) { return "https://twitter.com/intent/tweet?url=" + d.url + "&text=" + d.title + (d.extra.via ? "&via=" + d.extra.via : ''); },
        viber: function (d) { return "viber://forward?text=" + d.title + "%0D%0A" + d.url + (d.extra.text ? "%0D%0A%0D%0A" + d.extra.text : ''); },
        vkontakte: function (d) { return "https://vk.com/share.php?url=" + d.url + "&title=" + d.title + (d.extra.media ? "&image=" + d.extra.media : ''); },
        whatsapp: function (d) { return "whatsapp://send?text=" + d.title + "%0D%0A" + d.url + (d.extra.text ? "%0D%0A%0D%0A" + d.extra.text : ''); },
    };

    export default {
        props: {
            title: { default: 'Zaimki.pl' },
            networks: { default: ['twitter', 'reddit', 'facebook', 'telegram', 'whatsapp', 'messenger'] },
        },
        data() {
            return {
                preset: {
                    url: process.env.baseUrl + this.$route.path,
                    title: this.title,
                    extra: {
                        media: '',
                        text: '',
                        via: '',
                    },
                }
            };
        },
        methods: {
            link(network) {
                return NETWORKS[network](this.preset);
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import 'shareon/dist/shareon.min.css';
</style>
