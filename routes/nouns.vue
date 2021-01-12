<template>
    <div>
        <h2>
            <Icon v="book"/>
            <T>nouns.headerLonger</T>
        </h2>

        <NounsNav/>

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
    import NounsNav from "../data/nouns/NounsNav.vue";
    import NounsExtra from "../data/nouns/NounsExtra.vue";
    import hash from "../plugins/hash";

    export default {
        components: { NounsNav, NounsExtra },
        mixins: [ hash ],
        mounted() {
            this.handleHash(this.config.nouns.hashNamespace || '', filter => {
                if (this.$refs.dictionarywrapper) {
                    this.$refs.dictionarywrapper.open = true;
                    this.$refs.collapsabledictionary.setFilter(filter);
                } else {
                    this.$refs.dictionary.setFilter(filter);
                }
            });
        },
        head() {
            return head({
                title: this.$t('nouns.headerLonger'),
                description: this.$t('nouns.description'),
            });
        },
    }
</script>
