<template>
    <Page>
        <CommunityNav/>

        <h2>
            <Icon v="flag"/>
            <T>terminology.headerLong</T>
        </h2>

        <section>
            <T>terminology.info</T>
            <Share :title="$t('terminology.headerLong')"/>
        </section>

        <ModerationRules type="rulesTerminology" emphasise/>

        <AdPlaceholder phkey="main-0"/>

        <TermsDictionary load ref="termsdictionary"/>
    </Page>
</template>

<script>
    import { head } from "../src/helpers";
    import hash from "../plugins/hash";
    import NounsNav from "../data/nouns/NounsNav.vue";

    export default {
        components: { NounsNav },

        mixins: [ hash ],
        mounted() {
            this.handleHash(this.config.terminology.hashNamespace || '', filter => {
                this.$refs.termsdictionary.setFilter(filter);
            });
        },
        head() {
            return head({
                title: this.$t('terminology.headerLong'),
                description: this.$t('terminology.info')[0],
            });
        },
    }
</script>
