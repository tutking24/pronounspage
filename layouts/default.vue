<template>
    <div class="d-flex flex-column vh-100 body">
        <div class="flex-grow-1">
            <Header/>
            <main class="container">
                <Nuxt/>
                <ScrollButton/>
            </main>
        </div>
        <div class="container">
            <Footer/>
        </div>
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
            Vue.prototype.$confirm = (message, color='primary') => {
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
            this.setMode(this.detectDark());

            if (process.client) {
                sorter();
            }

            if (process.env.NODE_ENV === 'production') {
                this.$loadScript('arc', 'https://arc.io/widget.min.js#yHdNYRkC');
            }
        }
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
</style>
