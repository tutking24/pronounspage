<template>
    <div>
        <LinksNav/>

        <h2>
            <Icon v="zine.svg" :inverse="darkMode"/>
            <T>links.zine.headerLong</T>
        </h2>

        <T>links.zine.info</T>

        <h3 class="mb-3">
            <Icon v="bullhorn"/>
            <T>links.zine.submissions.header</T>
        </h3>

        <ZineSubmissions v-if="config.links.zine.open" class="alert alert-info"/>
        <div v-else>
            <div class="alert alert-warning">
                <p class="h6 mb-0">
                    <Icon v="exclamation-triangle"/>
                    <T>links.zine.submissions.closed</T>
                </p>
            </div>
            <details class="border mb-3">
                <summary class="bg-light p-3">
                    <T>links.zine.submissions.header</T>
                </summary>
                <ZineSubmissions class="p-3 border-top"/>
            </details>
        </div>

        <Separator icon="heart"/>
        <Support/>
        <section>
            <Share :title="$t('links.zine.header')"/>
        </section>
    </div>
</template>

<script>
    import { head } from "../src/helpers";
    import {mapState} from "vuex";

    export default {
        computed: {
            ...mapState([
                'darkMode',
            ]),
        },
        head() {
            return head({
                title: this.$t('links.zine.headerLong'),
            });
        },
    };
</script>
