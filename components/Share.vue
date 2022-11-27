<template>
    <div>
        <p class="small mb-0" v-if="!nolabel">
            <Icon v="share"/>
            <T>share</T><T>quotation.colon</T>
        </p>
        <button class="btn btn-primary m-1" v-if="hasShareApi" @click="shareApi">
            <Icon v="share"/>
            <span class="d-none d-md-inline"><T>share</T></span>
        </button>
        <button :class="['btn', justCopied ? 'btn-success' : 'btn-outline-primary', 'm-1']" ref="clipboard"
                :data-clipboard-text="preset.url"
                @click="copied" :aria-label="$t('crud.copy')" :title="$t('crud.copy')">
            <Icon :v="justCopied ? 'clipboard-check' : 'clipboard'"/>
            <span v-if="!hasShareApi" class="d-none d-md-inline"><T>crud.copy</T></span>
        </button>
        <br/>
        <SquareButton v-for="network in networks" :key="network" :link="link(network)" :colour="colour(network)" :aria-label="network">
            <Icon :v="icon(network)" set="b"/>
        </SquareButton>
    </div>
</template>

<script>
    import ClipboardJS from 'clipboard';
    import {COLOURS} from '../src/contact';

    // adapted from https://shareon.js.org (MIT)
    // can't use from yarn, because window.onload conflicts with SSR

    const NETWORKS = {
        mastodon: function (d) { return `https://toot.kytta.dev/?text=${d.title}%0A%0A${d.url}`; },
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

    const ICONS = {
        messenger: 'facebook-messenger',
        reddit: 'reddit-alien',
        telegram: 'telegram-plane',
        facebook: 'facebook-f',
        vkontakte: 'vk',
    }

    export default {
        props: {
            title: { default: 'Zaimki.pl' },
            networks: { default: _ => ['mastodon', 'twitter', 'facebook', 'telegram', 'whatsapp', 'messenger'] },
            nolabel: { type: Boolean },
        },
        data() {
            return {
                hasShareApi: false,
                preset: {
                    url: this.$base + this.$route.path,
                    title: this.title,
                    extra: {
                        media: '',
                        text: '',
                        via: '',
                    },
                },
                justCopied: false,
            };
        },
        mounted() {
            if (process.client) {
                this.hasShareApi = navigator.share !== undefined;

                new ClipboardJS(this.$refs.clipboard);
            }
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
            },
            shareApi() {
                navigator.share({
                    url: this.preset.url,
                    title: this.preset.title,
                    text: this.preset.extra.text,
                });
            },
            copied() {
                this.justCopied = true;
                setTimeout(() => this.justCopied = false, 2000);
            },
        },
    }
</script>
