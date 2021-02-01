<template>
    <NotFound v-if="!selectedPronoun"/>
    <div v-else>
        <h2>
            <Icon v="tag"/>
            <T>pronouns.intro</T>:
        </h2>

        <section>
            <div class="alert alert-primary">
                <h2 class="text-center mb-0">
                    <template v-if="nameOptions.length === 1">
                        <strong>{{ selectedPronoun.name(glue) }}</strong><small v-if="selectedPronoun.smallForm">/{{selectedPronoun.morphemes[selectedPronoun.smallForm]}}</small>
                    </template>
                    <template v-else>
                        <template v-for="(nameOption, i) in nameOptions">
                            <nuxt-link :to="'/' + addSlash(nameOption)">
                                <strong>
                                    <Spelling>{{ nameOption }}</Spelling>
                                </strong>
                            </nuxt-link>
                            <span v-if="i < nameOptions.length - 1"><Spelling>{{ glue }}</Spelling></span>
                        </template>
                    </template>
                </h2>
                <p class="h6 small text-center mb-0 mt-2" v-if="selectedPronoun.description">
                    <em>
                        <Spelling>
                        ({{Array.isArray(selectedPronoun.description)
                            ? ($t('pronouns.alt.header') + ': ' + selectedPronoun.description.join(glue))
                            : selectedPronoun.description
                        }})
                        </Spelling>
                    </em>
                </p>
            </div>
        </section>

        <section>
            <h2 class="h4">
                <Icon v="file-signature"/>
                <T>pronouns.examples</T>:
            </h2>

            <ul>
                <li v-for="example in examples" class="my-1">
                    <Example :example="example" :pronoun="selectedPronoun" :counter="counter" pronunciation/>
                </li>
            </ul>
        </section>

        <section v-if="selectedPronoun.history">
            <template v-for="part in selectedPronoun.history.split('@')">
                <div v-if="part === '__generator__'" class="alert alert-warning">
                    <Icon v="exclamation-triangle"/>
                    <T>pronouns.generated</T>
                </div>
                <div v-else class="alert alert-info">
                    <Icon v="info-circle"/>
                    <LinkedText :text="part"/>
                </div>
            </template>
        </section>

        <GrammarTables :selectedPronoun="selectedPronoun" :counter="counter"/>

        <section v-if="pronounGroup && pronounGroup.group.description">
            <ul class="list-group mt-4">
                <li class="list-group-item">
                    <p class="h5">
                        {{ pronounGroup.group.name }}
                    </p>
                    <div class="small my-1">
                        <Icon v="info-circle"/>
                        <em v-html="pronounGroup.group.description"></em>
                    </div>
                    <ul class="list-unstyled">
                        <li v-for="pronoun in pronounGroup.groupPronouns" :key="pronoun.canonicalName">
                            <nuxt-link v-if="typeof pronoun === 'string'" :to="'/' + pronoun">
                                <strong>{{pronoun.replace(/&/g, ' ' + $t('pronouns.or') + ' ')}}</strong>
                            </nuxt-link>
                            <nuxt-link v-else :to="addSlash('/' + pronoun.canonicalName)">
                                <strong>{{pronoun.name(glue)}}</strong><small v-if="pronoun.smallForm">/{{pronoun.morphemes[pronoun.smallForm]}}</small>
                                –
                                <small>{{pronoun.description}}</small>
                            </nuxt-link>
                            <NormativeBadge v-if="pronoun.normative"/>
                        </li>
                    </ul>
                </li>
                <nuxt-link to="/" class="list-group-item list-group-item-action text-center">
                    <Icon v="ellipsis-h-alt"/>
                </nuxt-link>
            </ul>
        </section>

        <section>
            <Share :title="`${$t('pronouns.intro')}: ${selectedPronoun.name(glue)}`"/>
        </section>

        <section v-if="Object.values(groupedSources).filter(x => !!x).length">
            <Literature :pronoun="selectedPronoun" :sources="groupedSources"/>
        </section>

        <Separator icon="info"/>
        <section class="mb-0">
            <h2 class="h4">
                <Icon v="info-circle"/>
                <T>home.whatisit</T>
            </h2>
            <T>home.about</T>
            <Homepage align="center"/>
        </section>
    </div>
</template>

<script>
    import { examples, pronouns, getSources, pronounLibrary } from "~/src/data";
    import {buildPronoun} from "../src/buildPronoun";
    import {head} from "../src/helpers";
    import GrammarTables from "../data/pronouns/GrammarTables";
    import LinkedText from "../components/LinkedText";
    import {SourceLibrary} from "../src/classes";

    export default {
        components: {LinkedText, GrammarTables },
        data() {
            const selectedPronoun = this.config.pronouns.enabled
                ? buildPronoun(pronouns, decodeURIComponent(this.$route.path.substr(1).replace(/\/$/, '')))
                : null;

            return {
                examples,
                pronouns,
                glue: ' ' + this.$t('pronouns.or') + ' ',

                selectedPronoun,
                nameOptions: selectedPronoun ? selectedPronoun.nameOptions() : [],
                pronounGroup: pronounLibrary.find(selectedPronoun),

                counter: 0,
            }
        },
        async asyncData({app}) {
            return {
                sources: await app.$axios.$get(`/sources`),
            }
        },
        mounted() {
            if (process.client) {
                setInterval(_ => this.counter++, 1000);
            }
        },
        head() {
            return this.selectedPronoun ? head({
                title: `${this.$t('pronouns.intro')}: ${this.selectedPronoun.name(this.glue)}`,
                banner: `api/banner${this.$route.path.replace(/\/$/, '')}.png`,
            }) : {};
        },
        methods: {
            addSlash(link) {
                return link + (['*', `'`].includes(link.substr(link.length - 1)) ? '/' : '');
            },
        },
        computed: {
            sourceLibrary() {
                return new SourceLibrary(this.sources);
            },
            groupedSources() {
                let key = this.selectedPronoun.canonicalName;
                if (this.config.sources.mergePronouns[key] !== undefined) {
                    key = this.config.sources.mergePronouns[key];
                }
                return this.sourceLibrary.getForPronounExtended(key);
            },
        },
    }
</script>
