<template>
    <div>
        <p class="small mb-0">
            <Icon v="share"/>
            <T>share</T>:
        </p>
        <SquareButton v-for="network in networks" :key="network" :link="link(network)" :colour="colour(network)">
            <Icon :v="icon(network)" set="b"/>
        </SquareButton>
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

    const COLOURS = {
        facebook: '#1877F2',
        linkedin: '#2867B2',
        messenger: '#0099FF',
        odnoklassniki: '#EE8208',
        pinterest: '#e60023',
        pocket: '#EF4154',
        reddit: '#ff4500',
        telegram: '#179CDE',
        twitter: '#1da1f2',
        viber: '#7360f2',
        vkontakte: '#4680C2',
        whatsapp: '#25D366',
    }

    const ICONS = {
        messenger: 'facebook-messenger',
        reddit: 'reddit-alien',
        telegram: 'telegram-plane',
        facebook: 'facebook-f',
    }

    export default {
        props: {
            title: { default: 'Zaimki.pl' },
            networks: { default: _ => ['twitter', 'reddit', 'facebook', 'telegram', 'whatsapp', 'messenger'] },
        },
        data() {
            return {
                preset: {
                    url: process.env.BASE_URL + this.$route.path,
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
            },
            colour(network) {
                return COLOURS[network];
            },
            icon(network) {
                return ICONS[network] || network;
            }
        }
    }
</script>
