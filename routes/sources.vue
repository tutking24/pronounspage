<template>
    <Page>
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

        <AdPlaceholder phkey="main-0"/>

        <SourcesChart :sources="sources" label="all pronouns"/>

        <Loading :value="sourceLibrary" size="5rem"><template v-if="sourceLibrary !== undefined">

        <section v-show="config.sources.submit">
            <SourceSubmitForm v-show="submitShown" ref="form"/>
            <button v-show="!submitShown" class="btn btn-success w-100" @click="submitShown = true">
                <Icon v="plus-circle"/>
                <T>sources.submit.header</T>
            </button>
        </section>

        <section>
            <button v-if="!tocShown" class="btn btn-outline-primary w-100" @click="tocShown = true">
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

        <section v-if="$isGranted('sources')" class="px-3">
            <div class="alert alert-info">
                <strong>{{ sourceLibrary.countApproved }}</strong> <T>nouns.approved</T>,
                <a href="#" @click.prevent="filter='__awaiting__'">
                    <strong>{{ sourceLibrary.countPending }}</strong> <T>nouns.pending</T>.
                </a>
            </div>
        </section>

        <ModerationRules type="rulesSources" emphasise/>

        <section class="sticky-top bg-white">
            <div class="input-group mb-1 bg-white">
                <span class="input-group-text">
                    <Icon v="filter"/>
                </span>
                <input class="form-control border-primary" v-model="filter" :placeholder="$t('crud.filterLong')" ref="filter"/>
                <button v-if="filter" class="btn btn-outline-danger" @click="filter = ''; $refs.filter.focus()">
                    <Icon v="times"/>
                </button>
            </div>

            <div class="btn-group w-100">
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

        </template></Loading>

        <AdPlaceholder phkey="main-1"/>
    </Page>
</template>

<script>
    import { pronouns, pronounLibrary } from '../src/data'
    import { Source, SourceLibrary } from "../src/classes";
    import { head } from "../src/helpers";
    import hash from "../plugins/hash";

    export default {
        mixins: [ hash ],
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
                sources: undefined,
                sourceLibrary: undefined,
            };
        },
        async mounted() {
            if (!process.client) { return; }

            this.handleHash('', filter => {
                this.filter = filter;
                if (filter) {
                    this.$refs.filter.scrollIntoView();
                }
            });
            this.sources = await this.$axios.$get(`/sources`);
            this.sourceLibrary = new SourceLibrary(this.sources);
        },
        head() {
            return head({
                title: this.$t('sources.headerLonger'),
                description: this.$t('sources.subheader'),
            });
        },
        methods: {
            toId(str) {
                return str.replace(/\//g, '-').replace(/&/g, '_');
            },
            filterPronoun(pronoun) {
                if (this.sourceLibrary === undefined) { return false; }
                return this.sourceLibrary.getForPronoun(pronoun.canonicalName).length > 0;
            },
            edit(source) {
                this.submitShown = true;
                this.$nextTick(() => {
                    this.$refs.form.edit(source)
                });
            }
        },
        watch: {
            filter() {
                this.setHash('', this.filter);
            }
        },
    }
</script>
