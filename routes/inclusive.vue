<template>
    <div>
        <NounsNav/>

        <h2>
            <Icon v="book-heart"/>
            <T>inclusive.headerLong</T>
        </h2>

        <section>
            <T>inclusive.info</T>
            <Share :title="$t('inclusive.headerLong')"/>
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
            this.handleHash(this.config.inclusive.hashNamespace || '', filter => {
                this.$refs.inclusivedictionary.setFilter(filter);
            });
        },
        head() {
            return head({
                title: this.$t('inclusive.headerLong'),
                description: this.$t('inclusive.info')[0],
            });
        },
    }
</script>
