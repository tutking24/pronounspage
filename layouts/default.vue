<template>
    <div v-if="requiresLogin && !testerPasswordValid" class="body">
        <div class="container">
            <div class="alert alert-warning m-3 text-center">
                <Icon v="exclamation-triangle"/>
                This is a test server
            </div>
            <div class="m-3">
                <div class="input-group py-1">
                    <input class="form-control" type="password" placeholder="Password" v-model="testerPassword" @keydown.enter.prevent="checkTesterPassword"/>
                    <button type="button" class="btn btn-primary btn-sm border" @click.prevent="checkTesterPassword">
                        <Icon v="sign-in"/>
                        Sign in
                    </button>
                </div>
                <p v-if="testerPasswordCookie && !testerPasswordValid" class="small text-danger">
                    <Icon v="exclamation-triangle"/>
                    Password invalid
                </p>
            </div>
        </div>
    </div>
    <div v-else class="body">
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
    import md5 from 'js-md5';

    // no need to be super secure, just a sign that the page is not public
    const TESTER_PASSWORD_COOKIE_KEY = 'tester-password';
    const TESTER_PASSWORD_HASH = '82feeb96d60170e714df8fb062301e90';

    export default {
        mixins: [dark],
        data() {
            return {
                requiresLogin: this.config.locale !== '_' && (
                    !this.locales[this.config.locale]
                    || !this.locales[this.config.locale].published
                    || process.env.NODE_ENV === 'test'
                    || process.env.BASE_URL.includes('test.pronouns.page')
                ),
                testerPassword: '',
                testerPasswordCookie: this.$cookies.get(TESTER_PASSWORD_COOKIE_KEY),
            }
        },
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
            this.loadGTM();
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
            },
            async loadGTM() {
                if (!this.adsEnabled) { return; }

                await this.$loadScript('gtm', 'https://www.googletagmanager.com/gtag/js?id=G-TDJEP12Q3M');

                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-TDJEP12Q3M');
            },
            checkTesterPassword() {
                this.$cookies.set(TESTER_PASSWORD_COOKIE_KEY, this.testerPassword);
                this.testerPasswordCookie = this.testerPassword;
            },
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
            testerPasswordValid() {
                return this.testerPasswordCookie && md5(this.testerPasswordCookie) === TESTER_PASSWORD_HASH;
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
