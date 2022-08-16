<template>
    <NotFound v-if="!selectedPronoun"/>
    <div v-else>
        <h2 class="d-flex justify-content-between">
            <span>
                <Icon v="tag"/>
                <T>pronouns.intro</T><T>quotation.colon</T>
            </span>
            <div v-if="nameOptions.length > 1" class="btn-group" role="group">
                <button :class="['btn btn-sm', counterSpeed === 0 ? 'btn-primary' : 'btn-outline-primary']" @click="counterPause"><Icon v="pause"/></button>
                <button :class="['btn btn-sm', counterSpeed === 3000 ? 'btn-primary' : 'btn-outline-primary']" @click="counterSlow"><Icon v="play"/></button>
                <button :class="['btn btn-sm', counterSpeed === 1000 ? 'btn-primary' : 'btn-outline-primary']" @click="counterFast"><Icon v="forward"/></button>
            </div>
        </h2>

        <section>
            <div class="alert alert-primary">
                <h2 class="text-center mb-0">
                    <template v-if="nameOptions.length === 1">
                        <Twemoji><strong><Spelling :text="selectedPronoun.name(glue)"/></strong><small v-if="selectedPronoun.smallForm">/<Spelling :text="selectedPronoun.morphemes[selectedPronoun.smallForm]"/></small></Twemoji>
                    </template>
                    <template v-else>
                        <template v-for="(nameOption, i) in nameOptions">
                            <nuxt-link :to="'/' + addSlash(nameOption)">
                                <Twemoji>
                                    <strong>
                                        <Spelling :text="nameOption" escape/>
                                    </strong>
                                </Twemoji>
                            </nuxt-link>
                            <span v-if="i < nameOptions.length - 1"><Spelling :text="glue"/></span>
                        </template>
                    </template>
                </h2>
                <p class="h6 small text-center mb-0 mt-2" v-if="selectedPronoun.description">
                    <em>
                        (<Twemoji><LinkedText escape noicons :text="Array.isArray(selectedPronoun.description)
                            ? ($t('pronouns.alt.header') + ': ' + selectedPronoun.description.join(glue))
                            : selectedPronoun.description"/></Twemoji>)
                    </em>
                </p>
            </div>
        </section>

        <section>
            <h2 class="h4">
                <Icon v="file-signature"/>
                <T>pronouns.examples</T><T>quotation.colon</T>
            </h2>

            <ul>
                <li v-for="example in examples" class="my-1">
                    <Example :example="example" :pronoun="selectedPronoun" :counter="counter" pronunciation/>
                </li>
            </ul>
        </section>

        <section v-if="selectedPronoun.history">
            <template v-for="part in selectedPronoun.history.replace(/\\@/g, '###').split('@')">
                <div v-if="part === '__generator__'" class="alert alert-warning">
                    <Icon v="exclamation-triangle"/>
                    <T>pronouns.generated</T>
                </div>
                <div v-else class="alert alert-info">
                    <Icon v="info-circle"/>
                    <LinkedText :text="part.replace(/###/g, '@')" noicons/>
                </div>
            </template>
        </section>

        <GrammarTables :selectedPronoun="selectedPronoun" :counter="counter"/>

        <PronounGroup :pronounGroup="pronounGroup"/>

        <Avoiding v-if="isNull"/>

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
    import {GrammarTables} from "../src/localeData";
    import LinkedText from "../components/LinkedText";
    import {SourceLibrary} from "../src/classes";

    export default {
        components: {LinkedText, GrammarTables },
        data() {
            const key = decodeURIComponent(this.$route.path.substr(1).replace(/\/$/, ''));
            const selectedPronoun = this.config.pronouns.enabled
                ? buildPronoun(pronouns, key)
                : null;

            return {
                examples,
                pronouns,
                glue: ' ' + this.$t('pronouns.or') + ' ',

                selectedPronoun,
                nameOptions: selectedPronoun ? selectedPronoun.nameOptions() : [],
                pronounGroup: pronounLibrary.find(selectedPronoun),

                counter: 0,
                counterHandle: null,
                counterSpeed: 1000,

                isNull: key.startsWith(':'),
            }
        },
        async asyncData({app}) {
            return {
                sources: await app.$axios.$get(`/sources`),
            }
        },
        mounted() {
            if (process.client) {
                this.counterSlow();
            }
        },
        head() {
            return this.selectedPronoun ? head({
                title: `${this.$t('pronouns.intro')}: ${this.selectedPronoun.name(this.glue)}`,
                description: [
                    this.$t('pronouns.examples', {}, false),
                    this.$t('pronouns.grammarTable', {}, false),
                    this.$t('sources.headerLong', {}, false),
                ].filter(x => !!x).join(', '),
                banner: `api/banner${this.$route.path.replace(/\/$/, '')}.png`,
            }) : {};
        },
        methods: {
            addSlash(link) {
                return link + (['*', `'`].includes(link.substr(link.length - 1)) ? '/' : '');
            },
            counterClear() {
                if (this.counterHandle) {
                    clearInterval(this.counterHandle);
                }
            },
            counterPause() {
                this.counterSpeed = 0;
                this.counterClear();
            },
            counterSlow() {
                this.counterSpeed = 3000;
                this.counterClear();
                this.counter++;
                this.counterHandle = setInterval(_ => this.counter++, this.counterSpeed);
            },
            counterFast() {
                this.counterSpeed = 1000;
                this.counterClear();
                this.counter++;
                this.counterHandle = setInterval(_ => this.counter++, this.counterSpeed);
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
