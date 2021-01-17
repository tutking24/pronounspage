<template>
    <div>
        <h2>
            <Icon v="book"/>
            <T>nouns.headerLonger</T>
        </h2>

        <NounsNav/>

        <h3>
            <Icon v="book-heart"/>
            <T>nouns.inclusive.headerLong</T>
        </h3>

        <section>
            <T>nouns.inclusive.info</T>
            <Share :title="$t('nouns.inclusive.headerLong')"/>
        </section>

        <InclusiveDictionary load ref="inclusivedictionary"/>
    </div>
</template>

<script>
    import { head } from "../src/helpers";
    import hash from "../plugins/hash";
    import NounsNav from "../data/nouns/NounsNav.vue";

    export default {
        components: { NounsNav },
        mixins: [ hash ],
        mounted() {
            this.handleHash(this.config.nouns.inclusive.hashNamespace || '', filter => {
                this.$refs.inclusivedictionary.setFilter(filter);
            });
        },
        head() {
            return head({
                title: this.$t('nouns.inclusive.headerLong'),
                description: this.$t('nouns.inclusive.info')[0],
            });
        },
    }
</script>
