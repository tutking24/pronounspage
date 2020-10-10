<template>
    <div class="container">
        <h2>
            <Icon v="books"/>
            <T>sources.headerLonger</T>
        </h2>

        <p v-if="$t('sources.subheader')">
            <em><T>sources.subheader</T></em>
        </p>

        <section>
            <Share :title="$t('sources.headerLonger')"/>
        </section>

        <section>
            <button v-if="!tocShown" class="btn btn-outline-primary btn-block" @click="tocShown = true">
                <Icon v="list"/>
                <T>sources.toc</T>
            </button>
            <ul v-if="tocShown" class="list-group">
                <li v-for="[group, groupTemplates] in templateLibrary.split(filterTemplate, false)" class="list-group-item">
                    <p class="h5">
                        {{ group.name }}
                    </p>
                    <div class="small my-1" v-if="group.description">
                        <Icon v="info-circle"/>
                        <em v-html="group.description"></em>
                    </div>
                    <ul class="list-unstyled">
                        <li v-for="template in groupTemplates" :key="template.canonicalName">
                            <a v-if="typeof template === 'string'" :href="'#' + toId(template)">
                                <strong>{{ template.replace(/&/g, glue) }}</strong>
                            </a>
                            <a v-else :href="'#' + toId(template.name(glue))">
                                <strong>{{ template.name(glue) }}</strong>
                                –
                                <small>{{ template.description }}</small>
                            </a>
                            <NormativeBadge v-if="template.normative"/>
                        </li>
                    </ul>
                </li>
                <li class="list-group-item">
                    <p class="h5 mb-0">
                        <a :href="'#' + $t('template.othersRaw')">
                            <strong><T>template.others</T></strong>
                        </a>
                    </p>
                </li>
            </ul>
        </section>

        <section>
            <span class="mr-2 mb-3">
                <Icon v="filter"/>
                <T>crud.filter</T>:
            </span>
            <div class="d-inline-block d-md-none">
                <div class="btn-group-vertical">
                    <button v-for="(icon, type) in sourceTypes"
                            :class="['btn', type === filter ? 'btn-primary' : 'btn-outline-primary']"
                            @click="filter = type"
                    >
                        <Icon :v="icon"/>
                        <T>sources.type.{{type || 'All'}}</T>
                    </button>
                </div>
            </div>
            <div class="d-none d-md-inline-block">
                <div class="btn-group">
                    <button v-for="(icon, type) in sourceTypes"
                            :class="['btn', type === filter ? 'btn-primary' : 'btn-outline-primary']"
                            @click="filter = type"
                    >
                        <Icon :v="icon"/>
                        <T>sources.type.{{type || 'All'}}</T>
                    </button>
                </div>
            </div>
        </section>

        <section v-for="template in templates" v-if="template.sources.length">
            <h2 class="h4" :id="toId(template.name(glue))">
                <nuxt-link :to="'/' + template.pronoun()">
                    {{ template.description }}
                    <small>({{ template.name(glue) }})</small>
                </nuxt-link>
            </h2>

            <ul class="list-unstyled">
                <li v-for="source in template.sources">
                    <Source :name="source" :filter="filter"/>
                </li>
            </ul>
        </section>

        <section v-for="(sources, multiple) in sourcesForMultipleForms">
            <h2 class="h4" :id="toId(multiple)">
                <nuxt-link :to="'/' + multiple">
                    <T>template.alt.header</T>
                    <small>({{ multiple.replace(/&/g, ' lub ') }})</small>
                </nuxt-link>
            </h2>

            <ul class="list-unstyled">
                <li v-for="source in sources">
                    <Source :name="source" :filter="filter"/>
                </li>
            </ul>
        </section>

        <section>
            <h2 class="h4" :id="$t('template.othersRaw')">
                <T>template.others</T>
            </h2>

            <ul class="list-unstyled">
                <li v-for="source in otherSources">
                    <Source :name="source" :filter="filter"/>
                </li>
            </ul>
        </section>
    </div>
</template>

<script>
    import { templates, sources, templateLibrary } from '../src/data'
    import sourcesForMultipleForms from '../data/sourcesMultiple';
    import { Source } from "../src/classes";
    import { head } from "../src/helpers";

    export default {
        data() {
            return {
                templates: templates,
                sourcesForMultipleForms: sourcesForMultipleForms,
                templateLibrary: templateLibrary,
                tocShown: false,
                sourceTypes: Source.TYPES,
                filter: '',
                glue: ' ' + this.$t('template.or') + ' ',
            };
        },
        mounted() {
            if (process.client && window.location.hash) {
                const $hashEl = this.$el.querySelector(window.location.hash);
                if ($hashEl) {
                    $hashEl.scrollIntoView();
                }
            }
        },
        head() {
            return head({
                title: this.$t('sources.headerLonger'),
            });
        },
        computed: {
            otherSources() {
                const other = new Set(Object.keys(sources));
                for (let template of Object.values(this.templates)) {
                    for (let source of template.sources) {
                        other.delete(source);
                    }
                }
                for (let sources of Object.values(this.sourcesForMultipleForms)) {
                    for (let source of sources) {
                        other.delete(source);
                    }
                }
                return other;
            },
        },
        methods: {
            toId(str) {
                return str.replace(/\//g, '-').replace(/&/g, '_');
            },
            filterTemplate(t) {
                if (typeof t === 'string') {
                    return Object.keys(sourcesForMultipleForms).includes(t);
                }
                return t.sources.length;
            }
        },
    }
</script>
