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

        <section v-if="config.sources.submit">
            <button v-if="!submitShown" class="btn btn-outline-success btn-block" @click="submitShown = true">
                <Icon v="plus-circle"/>
                <T>sources.submit.header</T>
            </button>
            <SourceSubmitForm v-else/>
        </section>

        <section>
            <button v-if="!tocShown" class="btn btn-outline-primary btn-block" @click="tocShown = true">
                <Icon v="list"/>
                <T>sources.toc</T>
            </button>
            <ul v-if="tocShown" class="list-group">
                <li v-for="[group, groupTemplates] in templateLibrary.split(filterTemplate, false)" v-if="groupTemplates.length" class="list-group-item">
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
                <li class="list-group-item" v-if="otherSources.length">
                    <p class="h5 mb-0">
                        <a :href="'#' + $t('template.othersRaw')">
                            <strong><T>template.others</T></strong>
                        </a>
                    </p>
                </li>
            </ul>
        </section>

        <section class="sticky-top bg-white">
            <div class="input-group mb-1 bg-white">
                <div class="input-group-prepend">
                    <span class="input-group-text">
                        <Icon v="filter"/>
                    </span>
                </div>
                <input class="form-control border-primary" v-model="filter" :placeholder="$t('crud.filterLong')" ref="filter"/>
                <div class="input-group-append" v-if="filter">
                    <button class="btn btn-outline-danger" @click="filter = ''; $refs.filter.focus()">
                        <Icon v="times"/>
                    </button>
                </div>
            </div>

            <div class="btn-group btn-block">
                <button v-for="(icon, type) in sourceTypes"
                        :class="['btn btn-sm', type === filterType ? 'btn-primary' : 'btn-outline-primary']"
                        @click="filterType = type"
                >
                    <Icon :v="icon"/>
                    <span class="d-none d-md-inline">
                        <T>sources.type.{{type || 'All'}}</T>
                    </span>
                </button>
            </div>
        </section>

        <section v-for="template in templates" v-if="template.sources.length">
            <SourceList :names="template.sources" :filter="filter" :filterType="filterType">
                <h2 class="h4" :id="toId(template.name(glue))">
                    <nuxt-link :to="'/' + template.pronoun()">
                        {{ template.description }}
                        <small>({{ template.name(glue) }})</small>
                    </nuxt-link>
                </h2>
            </SourceList>
        </section>

        <section v-for="(sources, multiple) in sourcesForMultipleForms">
            <SourceList :names="sources" :filter="filter" :filterType="filterType">
                <h2 class="h4" :id="toId(multiple)">
                    <nuxt-link :to="'/' + multiple">
                        <T>template.alt.header</T>
                        <small>({{ multiple.replace(/&/g, ' lub ') }})</small>
                    </nuxt-link>
                </h2>
            </SourceList>
        </section>

        <section v-if="otherSources.length">
            <SourceList :names="otherSources" :filter="filter" :filterType="filterType">
                <h2 class="h4" :id="$t('template.othersRaw')">
                    <T>template.others</T>
                </h2>
            </SourceList>
        </section>
    </div>
</template>

<script>
    import { templates, sources, templateLibrary } from '../src/data'
    import sourcesForMultipleForms from '../data/sources/sourcesMultiple';
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
                filterType: '',
                glue: ' ' + this.$t('template.or') + ' ',
                submitShown: false,
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
                return [...other];
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
