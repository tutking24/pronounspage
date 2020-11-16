<template>
    <div>
        <h2>
            <Icon v="atom-alt"/>
            <T>nouns.headerLong</T>
        </h2>

        <section>
            <T>nouns.intro</T>

            <Share :title="$t('nouns.headerLong')"/>
        </section>

        <NounsExtra>
            <details v-if="config.nouns.collapsable" class="border mb-3" ref="dictionarywrapper">
                <summary class="bg-light p-3" @click="$refs.collapsabledictionary.loadNouns()">
                    <h4 class="h5 d-inline">
                        <Icon v="book"/>
                        <T>nouns.dictionary</T>
                    </h4>
                </summary>
                <div class="border-top">
                    <Dictionary ref="collapsabledictionary"/>
                </div>
            </details>
            <Dictionary v-else load ref="dictionary"/>
        </NounsExtra>
    </div>
</template>

<script>
    import { head } from "../src/helpers";
    import NounsExtra from "../data/nouns/NounsExtra.vue";

    export default {
        components: { NounsExtra },
        mounted() {
            if (process.client) {
                if (window.location.hash) {
                    const anchor = decodeURIComponent(window.location.hash.substr(1));
                    this.$nextTick(_ => {
                        const $anchor = document.getElementById(anchor);
                        if ($anchor) {
                            $anchor.scrollIntoView();
                        } else {
                            if (this.$refs.dictionarywrapper) {
                                this.$refs.dictionarywrapper.open = true;
                                this.$refs.collapsabledictionary.setFilter(anchor);
                            } else {
                                this.$refs.dictionary.setFilter(anchor);
                            }
                        }
                    })
                }
            }
        },
        head() {
            return head({
                title: this.$t('nouns.headerLong'),
                description: this.$t('nouns.description'),
                banner: this.config.locale === 'pl' ? 'bannerNouns.png' : undefined,
            });
        },
    }
</script>
