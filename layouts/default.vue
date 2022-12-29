<template>
    <div class="body">
        <div class="flex-grow-1 vh">
            <Header/>
            <Nuxt/>
            <TranslationMode/>
            <ScrollButton/>
        </div>
        <Footer/>
        <DialogueBox ref="dialogue"/>
        <Lightbox/>
    </div>
</template>

<script>
    import Vue from 'vue';
    import dark from "../plugins/dark";
    import sorter from "avris-sorter";
    import {sleep} from "../src/helpers";

    export default {
        mixins: [dark],
        mounted() {
            Vue.prototype.$alert = (message, color='primary') => {
                return new Promise((resolve, reject) => {
                    this.$refs.dialogue.show(false, message, color, undefined, undefined, resolve, reject);
                });
            };
            Vue.prototype.$confirm = (message = '', color='primary') => {
                return new Promise((resolve, reject) => {
                    this.$refs.dialogue.show(true, message, color, undefined, undefined, resolve, reject);
                });
            };
            Vue.prototype.$editor = (value, message = '', color='primary') => {
                return new Promise((resolve, reject) => {
                    this.$refs.dialogue.show(false, message, color, value, 'lg', resolve, reject);
                });
            };
            Vue.prototype.$alertRaw = (message, color='primary') => {
                return new Promise((resolve, reject) => {
                    this.$refs.dialogue.show(false, '<pre class="text-start"><code>' + message + '</code></pre>', color, undefined, 'lg', resolve, reject);
                });
            };
            Vue.prototype.$post = (url, data, options = {}, timeout = 30000) => {
                return new Promise((resolve, reject) => {
                    this.$axios.$post(url, data, {...options, timeout})
                        .then(data => resolve(data))
                        .catch(async e => {
                            console.error(e);
                            await this.$alert(this.$t(e.response?.data?.error || 'error.generic'), 'danger');
                            reject();
                        });
                });
            };
            const darkMode = this.detectDark();
            this.setIsDark(darkMode);
            this.$store.commit('setDarkMode', darkMode);

            if (!process.client) { return; }

            sorter();

            this.confirmAge();

            this.loadAds();
        },
        methods: {
            async confirmAge() {
                if (!this.$te('footer.ageLimit') || localStorage.getItem('ageConfirmed')) {
                    return;
                }

                while (this.$refs.dialogue === undefined) {
                    await sleep(100);
                }
                await this.$alert(this.$t('footer.ageLimit'));

                localStorage.setItem('ageConfirmed', '1');
            },
            async loadAds() {
                if (!this.adsEnabled) { return; }

                await this.$loadScript('adsense', `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8518361481036191`);

                (window.adsbygoogle = window.adsbygoogle || []).push({});
            }
        },
        computed: {
            adsEnabled() {
                if (this.$isGranted()) {
                    const adsVisible = parseInt(localStorage.getItem('adsVisible') || '0') === 1;
                    if (!adsVisible) {
                        return false;
                    }
                }

                return this.config.ads?.enabled && process.env.NODE_ENV !== 'development';
            },
        },
    }
</script>

<style lang="scss">
    @import "assets/style";
    @import "~avris-sorter/dist/Sorter.min.css";

    @include media-breakpoint-up('lg', $grid-breakpoints) {
        .body {
            margin-top: $header-margin;
        }
        .sticky-top {
            top: $header-height - 1px;
        }
    }

    .vh {
        min-height: calc(100vh - #{$header-height});
    }
</style>
