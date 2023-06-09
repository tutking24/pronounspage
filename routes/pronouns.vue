<template>
    <Page>
        <section>
            <Suggested/>

            <div v-if="config.pronouns.sentence && config.pronouns.sentence.examples" class="alert alert-info small mt-3">
                <Icon v="lightbulb-on"/>
                <T>pronouns.sentence</T>
                <ul class="mb-0">
                    <li v-for="example in config.pronouns.sentence.examples">
                        <a :href="`https://${example}`" target="_blank" rel="noopener">{{ example }}</a>
                    </li>
                </ul>
                <T v-if="$te('pronouns.domainThanks')">pronouns.domainThanks</T>
            </div>

            <AdPlaceholder phkey="main-0"/>

            <ul class="list-group mt-4">
                <li v-for="[group, groupPronouns] in pronounLibrary.split()" class="list-group-item">
                    <p class="h5">
                        <Spelling :text="group.name"/>
                    </p>
                    <div class="small my-1" v-if="group.description">
                        <Icon v="info-circle"/>
                        <LinkedText :text="group.description"/>
                    </div>
                    <SimplePronounList :pronouns="groupPronouns"/>
                </li>
                <li class="list-group-item" id="generator">
                    <p class="h5">
                        <T>home.generator.header</T>
                    </p>
                    <p>
                        <T>home.generator.description</T>
                    </p>
                    <a v-if="!customise" href="#" @click.prevent="customise = true" class="btn btn-outline-primary w-100">
                        <Icon v="sliders-h-square"/>
                        <T>home.generator.button</T>
                    </a>
                    <div v-else class="card mb-5">
                        <div class="card-header">
                            <Icon v="sliders-h-square"/>
                            <T>home.generator.header2</T>
                        </div>
                        <div class="card-body">
                            <div class="card-title border-bottom pb-3">
                                <p><strong><T>home.generator.base</T><T>quotation.colon</T></strong></p>
                                <ul class="list-unstyled">
                                    <li v-for="[group, groupPronouns] in pronounLibrary.split()" >
                                        <ul class="list-inline">
                                            <li class="list-inline-item">
                                                <Spelling :text="group.name"/>
                                            </li>
                                            <li class="list-inline-item" v-for="(pronoun, pronounName) in groupPronouns">
                                                <button :class="['btn', pronoun.name(glue) === selectedPronoun.name(glue) ? 'btn-primary' : 'btn-outline-primary', 'btn-sm', 'my-1']"
                                                        @click="selectedPronoun = groupPronouns[pronounName].clone(true)"
                                                >
                                                    <Spelling :text="pronoun.name(glue)"/>
                                                </button>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </div>
                            <div class="alert alert-primary">
                                <p class="h3 mb-0 text-center">
                                    <Spelling :text="selectedPronoun.name(glue)"/>
                                    <template v-if="!config.pronouns.disableDescriptions">
                                        <br/>
                                        <input v-model="selectedPronoun.description"
                                               class="form-control form-input p-0 form-control-sm"
                                               :size="selectedPronoun.description.length ? selectedPronoun.description.length + 3 : 16"
                                               maxlength="64"
                                               :placeholder="$t('profile.description')"
                                        />
                                    </template>
                                </p>
                            </div>
                            <p>
                                <T>pronouns.examples</T><T>quotation.colon</T>
                            </p>
                            <template v-for="isHonorific in [false, true]" v-if="examples.filter(e => e.isHonorific === isHonorific).length">
                                <ul>
                                    <li v-for="example in examples" v-if="example.isHonorific === isHonorific">
                                        <span v-for="part in clearExampleParts(example[(isHonorific ? selectedPronoun.isPluralHonorific() : selectedPronoun.isPlural()) ? 'pluralParts' : 'singularParts'])">
                                            <input v-if="part.variable" v-model="selectedPronoun.morphemes[part.str]"
                                                   :class="['form-control form-input p-0', {'active': selectedMorpheme === part.str}]"
                                                   :size="selectedPronoun.morphemes[part.str] ? selectedPronoun.morphemes[part.str].length : 0"
                                                   maxlength="24"
                                                   @focus="selectedMorpheme = part.str"
                                                   @blur="selectedMorpheme = ''"
                                            />
                                            <span v-else><Spelling :text="part.str"/></span>
                                        </span>
                                    </li>
                                </ul>
                                <div class="my-3" v-if="config.pronouns.plurals">
                                    <div class="custom-control custom-switch" v-if="isHonorific">
                                        <input type="checkbox" class="custom-control-input" id="pluralHonorific" v-model="selectedPronoun.pluralHonorific[0]">
                                        <label class="custom-control-label" for="pluralHonorific"><T>pronouns.plural</T> <Icon v="level-up"/></label>
                                    </div>
                                    <div class="custom-control custom-switch" v-else>
                                        <input type="checkbox" class="custom-control-input" id="plural" v-model="selectedPronoun.plural[0]">
                                        <label class="custom-control-label" for="plural"><T>pronouns.plural</T> <Icon v="level-up"/></label>
                                    </div>
                                </div>
                            </template>
                            <p class="small">
                                <T icon="info-circle">home.generator.alt</T>
                            </p>
                            <!-- TODO #136
                            <p class="small" v-if="config.pronunciation.enabled && $te('home.generator.pronunciation')">
                                <Icon v="info-circle"/>
                                <T>home.generator.pronunciation</T>
                            </p>
                            -->
                            <div v-if="!usedBaseEquals && !config.pronouns.disableDisclaimer" class="alert alert-warning">
                                <Icon v="exclamation-triangle"/>
                                <T>pronouns.generated</T>
                            </div>
                        </div>
                        <div class="card-footer" v-if="link">
                            <LinkInput :link="link"/>
                        </div>
                    </div>
                </li>
                <li v-if="config.pronouns.multiple !== false" class="list-group-item" id="multiple">
                    <p class="h5">
                        <Spelling :text="config.pronouns.multiple.name"/>
                    </p>
                    <div class="small my-1" v-if="config.pronouns.multiple.description">
                        <Icon v="info-circle"/>
                        <em><Spelling :text="config.pronouns.multiple.description"/></em>
                    </div>
                    <SimplePronounList :pronouns="config.pronouns.multiple.examples" class="mb-3"/>
                    <a v-if="!customiseMultiple" href="#" @click.prevent="customiseMultiple = true" class="btn btn-outline-primary w-100">
                        <Icon v="sliders-h-square"/>
                        <T>pronouns.alt.button</T>
                    </a>
                    <div v-else class="card">
                        <div class="card-header">
                            <Icon v="sliders-h-square"/>
                            <T>pronouns.alt.header</T><T>quotation.colon</T>
                        </div>
                        <div class="card-body">
                            <div class="card-title">
                                <ul class="list-inline d-inline mb-0">
                                    <li class="list-inline-item" v-for="(pronoun, pronounName) in pronouns">
                                        <button :class="['btn', multiple.includes(pronounName) ? 'btn-primary' : 'btn-outline-primary', 'btn-sm', 'my-1']"
                                                @click="toggleMultiple(pronounName)"
                                        >
                                            <Spelling :text="pronoun.name()"/>
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="card-footer" v-if="linkMultiple">
                            <LinkInput :link="linkMultiple"/>
                        </div>
                    </div>
                </li>
                <li v-if="config.pronouns.null !== false" class="list-group-item" id="nameself">
                    <p class="h5">
                        <LinkedText :text="config.pronouns.null.description"/>
                        <NormativeBadge/>
                    </p>
                    <div class="small my-1" v-if="config.pronouns.null.history">
                        <Icon v="info-circle"/>
                        <LinkedText :text="config.pronouns.null.history"/>
                    </div>
                    <div class="small my-1">
                        <LinkedText :text="config.pronouns.null.template"/>
                    </div>
                    <SimplePronounList :pronouns="config.pronouns.null.examples" class="mb-3"/>
                </li>
                <li v-if="config.pronouns.emoji !== false" class="list-group-item">
                    <p class="h5">
                        <Spelling :text="config.pronouns.emoji.description"/>
                    </p>
                    <div class="small my-1" v-if="config.pronouns.emoji.history">
                        <Icon v="info-circle"/>
                        <LinkedText :text="config.pronouns.emoji.history"/>
                    </div>
                    <div class="small my-1">
                        <LinkedText :text="config.pronouns.emoji.template"/>
                    </div>
                    <SimplePronounList :pronouns="config.pronouns.emoji.examples" class="mb-3"/>
                </li>
                <li v-if="config.pronouns.mirror" class="list-group-item" id="mirror">
                    <p class="h5">
                        <nuxt-link :to="`/${config.pronouns.mirror.route}`">
                            <LinkedText :text="config.pronouns.mirror.name"/>
                        </nuxt-link>
                    </p>
                    <div class="small my-1" v-if="config.pronouns.mirror.description">
                        <Icon v="info-circle"/>
                        <LinkedText :text="config.pronouns.mirror.description"/>
                    </div>
                </li>
                <li v-if="config.pronouns.any" class="list-group-item">
                    <p class="h5">
                        <nuxt-link :to="`/${config.pronouns.any}`"><T>pronouns.any.header</T></nuxt-link>
                    </p>
                    <p>
                        <T>pronouns.any.description</T>
                    </p>
                    <ul v-if="Object.keys(pronounLibrary.byKey()).length" class="small">
                        <li>
                            <nuxt-link :to="`/${config.pronouns.any}`"><T>pronouns.any.short</T></nuxt-link>
                        </li>
                        <li v-for="(keyPronouns, key) in pronounLibrary.byKey()">
                            <nuxt-link :to="`/${config.pronouns.any}:${key}`"><T>pronouns.any.short</T> {{key}}</nuxt-link>
                        </li>
                    </ul>
                </li>
            </ul>
        </section>

        <AdPlaceholder phkey="main-1"/>

        <Separator icon="fist-raised"/>

        <Mission/>

        <Separator icon="heart"/>
        <Support/>
        <section>
            <Share/>
        </section>
    </Page>
</template>

<script>
    import { examples, pronouns, pronounLibrary } from "~/src/data";
    import { ExamplePart } from "~/src/classes";
    import Compressor from "../src/compressor";
    import MORPHEMES from '../data/pronouns/morphemes';
    import {mapState} from "vuex";
    import Suggested from "../data/pronouns/Suggested";

    export default {
        components: { Suggested },
        data() {
            return {
                examples,
                pronouns,
                pronounLibrary,

                selectedPronoun: pronouns[this.config.pronouns.default].clone(true),
                selectedMorpheme: '',

                customiseMultiple: false,
                multiple: this.config.pronouns.multiple ? this.config.pronouns.multiple.examples[0].split('&') : [],

                customise: this.config.pronouns.autoOpenGenerator || false,

                glue: ' ' + this.$t('pronouns.or') + ' ',
            }
        },
        computed: {
            ...mapState([
                'user',
            ]),
            usedBase() {
                const name = this.selectedPronoun.name(this.glue);
                for (let key in this.pronouns) {
                    if (this.pronouns.hasOwnProperty(key)) {
                        if (key === name) {
                            return key;
                        }
                        for (let alias of this.pronouns[key].aliases) {
                            if (alias === name) {
                                return key;
                            }
                        }
                    }
                }

                return null;
            },
            usedBaseEquals() {
                return this.usedBase && this.selectedPronoun.equals(this.pronouns[this.usedBase], true);
            },
            longLink() {
                const base = this.pronouns[this.selectedPronoun.morphemes[MORPHEMES[0]]];

                return base
                    ? Compressor.compress(
                        this.selectedPronoun.toArray().map(x => x.split('|')[0]),
                        base.toArray().map(x => x.split('|')[0])
                    ).join(',')
                    : this.selectedPronoun.toString();
            },
            link() {
                if (!this.selectedPronoun.pronoun()) {
                    return null;
                }

                const slashes = this.selectedPronoun.toStringSlashes();
                const commas = this.usedBaseEquals ? this.usedBase : this.longLink;

                const link = slashes && slashes.length < commas.length
                    ? slashes
                    : commas;

                return this.addSlash(this.$base + (this.config.pronouns.prefix || '') + '/' + link);
            },
            linkMultiple() {
                if (!this.multiple.length) {
                    return null;
                }

                return this.addSlash(this.$base + (this.config.pronouns.prefix || '') + '/' + this.multiple.join('&'));
            },
        },
        methods: {
            toggleMultiple(name) {
                const index = this.multiple.indexOf(name);
                if (index > -1) {
                    this.multiple.splice(index, 1);
                } else {
                    this.multiple.push(name);
                }
            },
            addSlash(link) {
                return link + (['*', `'`].includes(link.substr(link.length - 1)) ? '/' : '');
            },
            clearExampleParts(parts) {
                return parts.map(p => new ExamplePart(p.variable, p.str.replace(/^'/, '')));
            },
        },
    }
</script>

<style lang="scss">
    @import "../assets/style";

    .form-input {
        text-align: center;
        &.active {
            /*@include alert-variant(
                theme-color-level('primary', $alert-bg-level),
                theme-color-level('primary', $alert-border-level),
                theme-color-level('primary', $alert-color-level)
            );FIXME*/
        }
        &.form-control {
            width: auto;
            display: inline;
        }
        &[size="0"] {
            width: .5rem !important;
        }
    }

    /*@include media-breakpoint-up('md', $grid-breakpoints) {
        .btn-md-lg {
            @include button-size($btn-padding-y-lg, $btn-padding-x-lg, $btn-font-size-lg, $btn-line-height-lg, $btn-border-radius-lg);
        }
    }*/
</style>
