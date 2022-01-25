<template>
    <div class="body">
        <div class="flex-grow-1 vh">
            <Header/>
            <main class="container">
                <Nuxt/>
                <ScrollButton/>
            </main>
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

    export default {
        mixins: [dark],
        mounted() {
            Vue.prototype.$alert = (message, color='primary') => {
                return new Promise((resolve, reject) => {
                    this.$refs.dialogue.show(false, message, color, resolve, reject);
                });
            };
            Vue.prototype.$confirm = (message = '', color='primary') => {
                return new Promise((resolve, reject) => {
                    this.$refs.dialogue.show(true, message, color, resolve, reject);
                });
            };
            Vue.prototype.$post = (url, data, options = {}, timeout = 30000) => {
                return new Promise((resolve, reject) => {
                    this.$axios.$post(url, data, {...options, timeout})
                        .then(data => resolve(data))
                        .catch(async e => {
                            console.error(e);
                            await this.$alert(this.$t('error.generic'), 'danger');
                            reject();
                        });
                });
            };
            this.setIsDark(this.detectDark());

            if (!process.client) { return; }

            sorter();

            if (process.env.NODE_ENV === 'production') {
                //this.monkeyPatchBlockTrackers(['google-analytics.com', 'tkr.arc.io', 'browser.sentry-cdn.com',]);
                this.$loadScript('arc', 'https://arc.io/widget.min.js#yHdNYRkC');
            }
        },
        methods: {
            monkeyPatchBlockTrackers(trackers) {
                const isTracker = (url) => trackers.filter(t => url.includes(t)).length > 0;

                const origFetch = window.fetch;
                window.fetch = async (...args) => {
                    if (isTracker(args[0])) { return; }
                    return await origFetch(...args);
                };

                const origInsertBefore = window.Node.prototype.insertBefore;
                window.Node.prototype.insertBefore = function (...args) {
                    if (args[0] && args[0].tagName === 'SCRIPT' && isTracker(args[0].src)) { return; }
                    origInsertBefore.call(this, ...args);
                };
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
