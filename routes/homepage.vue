<template>
    <div class="container">
        <h2>
            <Icon v="tags"/>
            <T>home.why</T>
        </h2>

        <section>
            <T>home.about</T>
        </section>

        <section>
            <Share/>
        </section>

        <Separator icon="link"/>

        <section>
            <h2>
                <Icon v="tags"/>
                <T>home.pronouns</T>
            </h2>

            <ul class="list-group mt-4">
                <li v-for="[group, groupPronouns] in pronounLibrary.split()" class="list-group-item">
                    <p class="h5">
                        {{ group.name }}
                    </p>
                    <div class="small my-1" v-if="group.description">
                        <Icon v="info-circle"/>
                        <LinkedText :text="group.description"/>
                    </div>
                    <SimplePronounList :pronouns="groupPronouns"/>
                </li>
                <li v-if="config.pronouns.multiple !== false" class="list-group-item">
                    <p class="h5">
                        {{ config.pronouns.multiple.name }}
                    </p>
                    <div class="small my-1" v-if="config.pronouns.multiple.description">
                        <Icon v="info-circle"/>
                        <em v-html="config.pronouns.multiple.description"></em>
                    </div>
                    <SimplePronounList :pronouns="config.pronouns.multiple.examples" class="mb-3"/>
                    <a v-if="!customiseMultiple" href="#" @click.prevent="customiseMultiple = true" class="btn btn-outline-primary btn-block">
                        <Icon v="sliders-h-square"/>
                        <T>pronouns.alt.button</T>
                    </a>
                    <div v-else class="card">
                        <div class="card-header">
                            <Icon v="sliders-h-square"/>
                            <T>pronouns.alt.header</T>:
                        </div>
                        <div class="card-body">
                            <div class="card-title">
                                <ul class="list-inline d-inline mb-0">
                                    <li class="list-inline-item" v-for="(pronoun, pronounName) in pronouns">
                                        <button :class="['btn', multiple.includes(pronounName) ? 'btn-primary' : 'btn-outline-primary', 'btn-sm', 'my-1']"
                                                @click="toggleMultiple(pronounName)"
                                        >
                                            {{pronoun.name()}}
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
                <li v-if="config.pronouns.null !== false" class="list-group-item">
                    <p class="h5">
                        {{ config.pronouns.null.description }}
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
                        {{ config.pronouns.emoji.description }}
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
                <li class="list-group-item">
                    <p class="h5">
                        <T>home.generator.header</T>
                    </p>
                    <p>
                        <T>home.generator.description</T>
                    </p>
                    <a v-if="!customise" href="#" @click.prevent="customise = true" class="btn btn-outline-primary btn-block">
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
                                <ul class="list-inline d-inline mb-0">
                                    <li class="list-inline-item pt-1 h5">
                                        <T>home.generator.base</T>:
                                    </li>
                                    <li class="list-inline-item" v-for="(pronoun, pronounName) in pronouns">
                                        <button :class="['btn', pronoun.name(glue) === selectedPronoun.name(glue) ? 'btn-primary' : 'btn-outline-primary', 'btn-sm', 'my-1']"
                                                @click="selectedPronoun = pronouns[pronounName].clone()"
                                        >
                                            {{pronoun.name(glue)}}
                                        </button>
                                    </li>
                                </ul>
                            </div>

                            <div class="alert alert-primary">
                                <p class="h3 mb-0 text-center">
                                    {{ selectedPronoun.name(glue) }}
                                    <br/>
                                    <input v-model="selectedPronoun.description"
                                           class="form-control form-input p-0 form-control-sm"
                                           :size="selectedPronoun.description.length + 3"
                                           maxlength="48"
                                    />
                                </p>
                            </div>

                            <p>
                                <T>pronouns.examples</T>:
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
                                            <span v-else>{{part.str}}</span>
                                        </span>
                                    </li>
                                </ul>
                                <div class="my-3">
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
                                <Icon v="info-circle"/>
                                <T>home.generator.alt</T>
                            </p>
                            <p class="small" v-if="config.pronunciation.enabled">
                                <Icon v="info-circle"/>
                                <T>home.generator.pronunciation</T>
                            </p>
                        </div>
                        <div class="card-footer" v-if="link">
                            <LinkInput :link="link"/>
                        </div>
                    </div>
                </li>
                <li class="list-group-item">
                    <p class="h5">
                        <nuxt-link :to="'/' + config.pronouns.any"><T>pronouns.any.header</T></nuxt-link>
                    </p>
                    <p>
                        <T>pronouns.any.description</T>
                    </p>
                </li>
                <li v-if="config.pronouns.avoiding" class="list-group-item">
                    <p class="h5">
                        <nuxt-link :to="'/' + config.pronouns.avoiding"><T>pronouns.avoiding.header</T></nuxt-link>
                    </p>
                    <p>
                        <T>pronouns.avoiding.description</T>
                    </p>
                </li>
            </ul>
        </section>

        <Separator icon="bookmark"/>

        <section>
            <Media/>
            <Socials/>
        </section>
    </div>
</template>

<script>
    import { examples, pronouns, pronounLibrary } from "~/src/data";
    import { ExamplePart } from "~/src/classes";
    import Compressor from "../src/compressor";
    import MORPHEMES from '../data/pronouns/morphemes';

    export default {
        data() {
            return {
                examples,
                pronouns,
                pronounLibrary,

                selectedPronoun: pronouns[this.config.pronouns.default].clone(),
                selectedMorpheme: '',

                customiseMultiple: false,
                multiple: ['on', 'ona'],

                customise: false,

                glue: ' ' + this.$t('pronouns.or') + ' ',
            }
        },
        computed: {
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
                return this.usedBase && this.pronouns[this.usedBase].equals(this.selectedPronoun);
            },
            longLink() {
                const base = this.pronouns[this.selectedPronoun.morphemes[MORPHEMES[0]]];

                return base
                    ? Compressor.compress(this.selectedPronoun.toArray(), base.toArray()).join(',')
                    : this.selectedPronoun.toString();
            },
            link() {
                if (!this.selectedPronoun.pronoun()) {
                    return null;
                }
                return this.addSlash(this.$base + '/' + (this.usedBaseEquals ? this.usedBase : this.longLink));
            },
            linkMultiple() {
                if (!this.multiple.length) {
                    return null;
                }

                return this.addSlash(this.$base + '/' + this.multiple.join('&'));
            },
        },
        methods: {
            toggleMultiple(name) {
                const index = this.multiple.indexOf(name);
                if (homepage > -1) {
                    this.multiple.splice(homepage, 1);
                } else {
                    this.multiple.push(name);
                }
            },
            addSlash(link) {
                return link + (link.substr(link.length - 1) === '*' ? '/' : '');
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
            @include alert-variant(
                theme-color-level('primary', $alert-bg-level),
                theme-color-level('primary', $alert-border-level),
                theme-color-level('primary', $alert-color-level)
            );
        }
        &.form-control {
            width: auto;
            display: inline;
        }
        &[size="0"] {
            width: .5rem !important;
        }
    }

    @include media-breakpoint-up('md', $grid-breakpoints) {
        .btn-md-lg {
            @include button-size($btn-padding-y-lg, $btn-padding-x-lg, $btn-font-size-lg, $btn-line-height-lg, $btn-border-radius-lg);
        }
    }
</style>
