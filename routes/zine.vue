<template>
    <div>
        <LinksNav/>

        <h2>
            <Icon v="zine.svg" :inverse="darkMode"/>
            <T>links.zine.headerLong</T>
        </h2>

        <section v-if="config.links.zine.releases.length">
            <ul class="list-unstyled">
                <li v-for="release in config.links.zine.releases" class="d-flex flex-column flex-lg-row">
                    <img :src="`/img-local/zine/${release.cover}`" class="cover border shadow"/>
                    <div class="py-3 py-lg-0 px-lg-3">
                        <h3>{{release.title}}</h3>
                        <LinkedText :text="release.description"/>
                        <ul class="list-inline mt-3">
                            <li v-for="download in release.downloads" class="list-inline-item">
                                <a :href="`/api/download/${download.filename}`" class="btn btn-primary m-1">
                                    <Icon v="file-download"/>
                                    {{download.label}}
                                    <small v-if="stats[download.filename] !== undefined">({{stats[download.filename]}})</small>
                                </a>
                            </li>
                        </ul>
                    </div>
                </li>
            </ul>
            <Separator icon="bullhorn"/>
        </section>

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
        async asyncData({ app }) {
            let stats = {};
            try {
                stats = await app.$axios.$get(`/downloads`);
            } catch {}

            return {
                stats,
            };
        },
        computed: {
            ...mapState([
                'darkMode',
            ]),
        },
        head() {
            return head({
                title: this.$t('links.zine.headerLong'),
                banner: this.config.links.zine.releases.length
                    ? `img-local/zine/${this.config.links.zine.releases[0].banner}`
                    : null,
            });
        },
    };
</script>

<style lang="scss" scoped>
@import "assets/variables";

.cover {
    width: 100%;
    @include media-breakpoint-up('lg') {
        max-width: 16rem;
    }
}
</style>
