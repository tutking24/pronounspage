<template>
    <div>
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
            <SourceSubmitForm v-else ref="form"/>
        </section>

        <section>
            <button v-if="!tocShown" class="btn btn-outline-primary btn-block" @click="tocShown = true">
                <Icon v="list"/>
                <T>sources.toc</T>
            </button>
            <ul v-if="tocShown" class="list-group">
                <li v-for="[group, groupPronouns] in pronounLibrary.split(filterPronoun, false)" v-if="groupPronouns.length" class="list-group-item">
                    <p class="h5">
                        {{ group.name }}
                    </p>
                    <div class="small my-1" v-if="group.description">
                        <Icon v="info-circle"/>
                        <em v-html="group.description"></em>
                    </div>
                    <ul class="list-unstyled">
                        <li v-for="pronoun in groupPronouns" :key="pronoun.canonicalName" v-if="config.sources.mergePronouns[pronoun.canonicalName] === undefined">
                            <a v-if="typeof pronoun === 'string'" :href="'#' + toId(pronoun)">
                                <strong>{{ pronoun.replace(/&/g, glue) }}</strong>
                            </a>
                            <a v-else :href="'#' + toId(pronoun.name(glue))">
                                <strong>{{ pronoun.name(glue) }}</strong>
                                –
                                <small>{{ pronoun.description }}</small>
                            </a>
                            <NormativeBadge v-if="pronoun.normative"/>
                        </li>
                    </ul>
                </li>
                <li class="list-group-item" v-if="sourceLibrary.multiple.length">
                    <p class="h5 mb-0">
                        <a :href="'#' + $t('pronouns.alt.raw')">
                            <strong><T>pronouns.alt.header</T></strong>
                        </a>
                    </p>
                </li>
                <li class="list-group-item" v-if="sourceLibrary.getForPronoun('', pronounLibrary)">
                    <p class="h5 mb-0">
                        <a :href="'#' + $t('pronouns.othersRaw')">
                            <strong><T>pronouns.others</T></strong>
                        </a>
                    </p>
                </li>
            </ul>
        </section>

        <section v-if="$admin()" class="px-3">
            <div class="alert alert-info">
                <strong>{{ sourceLibrary.countApproved }}</strong> <T>nouns.approved</T>,
                <a href="#" @click.prevent="filter='__awaiting__'">
                    <strong>{{ sourceLibrary.countPending }}</strong> <T>nouns.pending</T>.
                </a>
            </div>
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

        <section v-for="pronoun in pronouns" v-if="config.sources.mergePronouns[pronoun.canonicalName] === undefined && sourceLibrary.getForPronoun(pronoun.canonicalName).length">
            <SourceList :sources="sourceLibrary.getForPronoun(pronoun.canonicalName)" :pronoun="pronoun" :filter="filter" :filterType="filterType" manage @edit-source="edit">
                <h2 class="h4" :id="toId(pronoun.name(glue))">
                    <nuxt-link :to="'/' + pronoun.canonicalName">
                        {{ pronoun.description }}
                        <small>({{ pronoun.name(glue) }})</small>
                    </nuxt-link>
                </h2>
            </SourceList>
        </section>

        <a :id="$t('pronouns.alt.raw')"/>
        <section v-for="multiple in sourceLibrary.multiple" v-if="sourceLibrary.getForPronoun(multiple).length">
            <SourceList :sources="sourceLibrary.getForPronoun(multiple)" :filter="filter" :filterType="filterType" manage @edit-source="edit">
                <h2 class="h4" :id="toId(multiple)">
                    <nuxt-link :to="'/' + multiple">
                        <T>pronouns.alt.header</T>
                        <small>({{ multiple.replace(/&/g, glue) }})</small>
                    </nuxt-link>
                </h2>
            </SourceList>
        </section>

        <section v-if="sourceLibrary.getForPronoun('', pronounLibrary)">
            <SourceList :sources="sourceLibrary.getForPronoun('', pronounLibrary)" :filter="filter" :filterType="filterType" manage @edit-source="edit">
                <h2 class="h4" :id="$t('pronouns.othersRaw')">
                    <T>pronouns.others</T>
                </h2>
            </SourceList>
        </section>
    </div>
</template>

<script>
    import { pronouns, pronounLibrary } from '../src/data'
    import { Source, SourceLibrary } from "../src/classes";
    import { head } from "../src/helpers";

    export default {
        data() {
            return {
                pronouns,
                pronounLibrary,
                tocShown: false,
                sourceTypes: Source.TYPES,
                filter: '',
                filterType: '',
                glue: ' ' + this.$t('pronouns.or') + ' ',
                submitShown: false,
            };
        },
        async asyncData({app}) {
            return {
                sources: await app.$axios.$get(`/sources`),
            }
        },
        mounted() {
            if (process.client && window.location.hash) {
                const anchor = decodeURIComponent(window.location.hash.substr(1));
                this.$nextTick(_ => {
                    const $anchor = document.getElementById(anchor);
                    if ($anchor) {
                        $anchor.scrollIntoView();
                    } else {
                        this.filter = anchor;
                    }
                })
            }
        },
        head() {
            return head({
                title: this.$t('sources.headerLonger'),
            });
        },
        computed: {
            sourceLibrary() {
                return new SourceLibrary(this.sources);
            },
        },
        methods: {
            toId(str) {
                return str.replace(/\//g, '-').replace(/&/g, '_');
            },
            filterPronoun(pronoun) {
                return this.sourceLibrary.getForPronoun(pronoun.canonicalName).length > 0;
            },
            edit(source) {
                this.submitShown = true;
                this.$nextTick(() => this.$refs.form.edit(source));
            }
        },
        watch: {
            filter() {
                if (process.client) {
                    if (this.filter) {
                        window.location.hash = this.filter;
                    } else {
                        history.pushState('', document.title, window.location.pathname + window.location.search);
                    }
                }
            }
        },
    }
</script>
