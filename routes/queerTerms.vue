<template>
    <div>
        <h2>
            <Icon v="flag"/>
            <T>nouns.terms.headerLong</T>
        </h2>

        <section>
            <T>nouns.terms.info</T>
            <Share :title="$t('nouns.terms.headerLong')"/>
        </section>

        <TermsDictionary load ref="termsdictionary"/>
    </div>
</template>

<script>
    import { head } from "../src/helpers";
    import hash from "../plugins/hash";

    export default {
        mixins: [ hash ],
        mounted() {
            this.handleHash(this.config.nouns.terms.hashNamespace || '', filter => {
                this.$refs.termsdictionary.setFilter(filter);
            });
        },
        head() {
            return head({
                title: this.$t('nouns.terms.headerLong'),
                description: this.$t('nouns.terms.info')[0],
            });
        },
    }
</script>
