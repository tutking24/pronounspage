<template>
    <div>
        <LinksNav/>

        <h2>
            <Icon v="zine.svg" :inverse="darkMode"/>
            <T>links.zine.headerLong</T>
        </h2>

        <section v-if="config.links.zine.releases.length">
            <ul class="list-unstyled">
                <li v-for="release in config.links.zine.releases" class="row">
                    <div class="col-12 col-lg-3">
                        <img :src="`/img-local/zine/${release.cover}`" class="cover border shadow"/>
                    </div>
                    <div class="col-12 col-lg-9 py-3 py-lg-0 px-lg-3">
                        <h3>{{release.title}}</h3>
                        <LinkedText :text="release.description"/>
                        <ul class="list-inline my-3">
                            <li v-for="({filename, icon}, format) in release.downloads" class="list-inline-item download-btn">
                                <a :href="`/api/download/${filename}`" class="btn btn-primary m-1"
                                   @mouseenter="selectedFormat = format"
                                   @mouseleave="selectedFormat = null"
                                >
                                    <Icon :v="icon || 'file-download'"/>
                                    <T>links.zine.format.{{format}}.name</T>
                                    <small v-if="stats[filename] !== undefined">({{stats[filename]}})</small>
                                </a>
                            </li>
                        </ul>
                        <p v-if="downloadsCount(release)">
                            <Icon v="download"/>
                            {{ downloadsCount(release) }}
                        </p>
                        <div v-if="selectedFormat" class="alert alert-info small">
                            <Icon v="info-circle"/>
                            <T>links.zine.format.{{selectedFormat}}.description</T>
                        </div>
                    </div>
                </li>
            </ul>
            <Separator icon="bullhorn"/>
        </section>

        <h3 class="mb-3">
            <Icon v="bullhorn"/>
            <T>links.zine.submissions.header</T>
        </h3>

        <T>links.zine.info</T>

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
        data() {
            return {
                selectedFormat: null,
            }
        },
        computed: {
            ...mapState([
                'darkMode',
            ]),
        },
        methods: {
            downloadsCount(release) {
                let count = 0;
                for (let {filename} of Object.values(release.downloads)) {
                    count += this.stats[filename] ?? 0;
                }
                return count;
            },
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
    height: auto;
}
@include media-breakpoint-down('lg') {
    .download-btn {
        display: block;
        margin-right: 0;
        .btn {
            display: block;
        }
    }
}
</style>
