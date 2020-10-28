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
                <T>home.templates</T>
            </h2>

            <ul class="list-group mt-4">
                <li v-for="[group, groupTemplates] in templateLibrary.split()" class="list-group-item">
                    <p class="h5">
                        {{ group.name }}
                    </p>
                    <div class="small my-1" v-if="group.description">
                        <Icon v="info-circle"/>
                        <em v-html="group.description"></em>
                    </div>
                    <ul class="list-unstyled">
                        <li v-for="template in groupTemplates" :key="template.canonicalName">
                            <nuxt-link v-if="typeof template === 'string'" :to="'/' + template">
                                <strong>{{template.replace(/&/g, ' ' + $t('template.or') + ' ')}}</strong>
                            </nuxt-link>
                            <nuxt-link v-else :to="addSlash('/' + template.canonicalName)">
                                <strong>{{template.name(glue)}}</strong>
                                –
                                <small>{{template.description}}</small>
                            </nuxt-link>
                            <NormativeBadge v-if="template.normative"/>
                        </li>
                    </ul>
                </li>
                <li class="list-group-item">
                    <a v-if="!customiseMultiple" href="#" @click.prevent="customiseMultiple = true" class="btn btn-outline-primary btn-block">
                        <Icon v="sliders-h-square"/>
                        <T>template.alt.button</T>
                    </a>
                    <div v-else class="card">
                        <div class="card-header">
                            <Icon v="sliders-h-square"/>
                            <T>template.alt.header</T>:
                        </div>
                        <div class="card-body">
                            <div class="card-title">
                                <ul class="list-inline d-inline mb-0">
                                    <li class="list-inline-item" v-for="(template, pronoun) in templates">
                                        <button :class="['btn', multiple.includes(pronoun) ? 'btn-primary' : 'btn-outline-primary', 'btn-sm', 'my-1']"
                                                @click="toggleMultiple(pronoun)"
                                        >
                                            {{template.name()}}
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
                                    <li class="list-inline-item" v-for="(template, pronoun) in templates">
                                        <button :class="['btn', template.name(glue) === selectedTemplate.name(glue) ? 'btn-primary' : 'btn-outline-primary', 'btn-sm', 'my-1']"
                                                @click="selectedTemplate = templates[pronoun].clone()"
                                        >
                                            {{template.name(glue)}}
                                        </button>
                                    </li>
                                </ul>
                            </div>

                            <div class="alert alert-primary">
                                <p class="h3 mb-0 text-center">
                                    {{ selectedTemplate.name(glue) }}
                                    <br/>
                                    <input v-model="selectedTemplate.description"
                                           class="form-control form-input p-0 form-control-sm"
                                           :size="selectedTemplate.description.length + 3"
                                           maxlength="48"
                                    />
                                </p>
                            </div>

                            <p>
                                <T>template.examples</T>:
                            </p>
                            <template v-for="isHonorific in [false, true]" v-if="examples.filter(e => e.isHonorific === isHonorific).length">
                                <ul>
                                    <li v-for="example in examples" v-if="example.isHonorific === isHonorific">
                                        <span v-for="part in clearExampleParts(example[(isHonorific ? selectedTemplate.isPluralHonorific() : selectedTemplate.isPlural()) ? 'pluralParts' : 'singularParts'])">
                                            <input v-if="part.variable" v-model="selectedTemplate.morphemes[part.str]"
                                                   :class="['form-control form-input p-0', {'active': selectedMorpheme === part.str}]"
                                                   :size="selectedTemplate.morphemes[part.str] ? selectedTemplate.morphemes[part.str].length : 0"
                                                   maxlength="12"
                                                   @focus="selectedMorpheme = part.str"
                                                   @blur="selectedMorpheme = ''"
                                            />
                                            <span v-else>{{part.str}}</span>
                                        </span>
                                    </li>
                                </ul>
                                <div class="my-3">
                                    <div class="custom-control custom-switch" v-if="isHonorific">
                                        <input type="checkbox" class="custom-control-input" id="pluralHonorific" v-model="selectedTemplate.pluralHonorific[0]">
                                        <label class="custom-control-label" for="pluralHonorific"><T>template.plural</T> <Icon v="level-up"/></label>
                                    </div>
                                    <div class="custom-control custom-switch" v-else>
                                        <input type="checkbox" class="custom-control-input" id="plural" v-model="selectedTemplate.plural[0]">
                                        <label class="custom-control-label" for="plural"><T>template.plural</T> <Icon v="level-up"/></label>
                                    </div>
                                </div>
                            </template>
                            <p class="small">
                                <Icon v="info-circle"/>
                                <T>home.generator.alt</T>
                            </p>
                            <div class="alert alert-warning">
                                <p class="mb-0 small">
                                    <Icon v="exclamation-triangle"/>
                                    <T>beta</T>
                                </p>
                            </div>
                        </div>
                        <div class="card-footer" v-if="link">
                            <LinkInput :link="link"/>
                        </div>
                        <div class="card-body border-top" v-if="Object.keys(sources).length">
                            <Literature :sources="sources"/>
                        </div>
                    </div>
                </li>
                <li class="list-group-item">
                    <p class="h5">
                        <nuxt-link :to="'/' + config.template.any.route"><T>template.any.header</T></nuxt-link>
                    </p>
                    <p>
                        <T>template.any.description</T>
                    </p>
                </li>
            </ul>
        </section>

        <Separator icon="bookmark"/>

        <section>
            <Links/>
            <Media/>
            <Socials/>
        </section>
    </div>
</template>

<script>
    import { examples, templates, getSources, templateLibrary } from "~/src/data";
    import { ExamplePart } from "~/src/classes";
    import Compressor from "../src/compressor";
    import { getTemplate } from "../src/buildTemplate";
    import MORPHEMES from '../data/templates/morphemes';

    export default {
        data() {
            return {
                examples: examples,
                templates: templates,
                getTemplate: getTemplate,
                templateLibrary: templateLibrary,

                selectedTemplate: templates[this.config.template.default].clone(),
                selectedMorpheme: '',

                customiseMultiple: false,
                multiple: ['on', 'ona'],

                customise: false,

                glue: ' ' + this.$t('template.or') + ' ',
            }
        },
        computed: {
            usedBase() {
                const name = this.selectedTemplate.name(this.glue);
                for (let key in this.templates) {
                    if (this.templates.hasOwnProperty(key)) {
                        if (key === name) {
                            return key;
                        }
                        for (let alias of this.templates[key].aliases) {
                            if (alias === name) {
                                return key;
                            }
                        }
                    }
                }

                return null;
            },
            usedBaseEquals() {
                return this.usedBase && this.templates[this.usedBase].equals(this.selectedTemplate);
            },
            longLink() {
                const base = this.templates[this.selectedTemplate.morphemes[MORPHEMES[0]]];

                return base
                    ? Compressor.compress(this.selectedTemplate.toArray(), base.toArray()).join(',')
                    : this.selectedTemplate.toString();
            },
            link() {
                if (!this.selectedTemplate.pronoun()) {
                    return null;
                }
                return this.addSlash(process.env.BASE_URL + '/' + (this.usedBaseEquals ? this.usedBase : this.longLink));
            },
            linkMultiple() {
                if (!this.multiple.length) {
                    return null;
                }

                return this.addSlash(process.env.BASE_URL + '/' + this.multiple.join('&'));
            },
            sources() {
                return getSources(this.selectedTemplate);
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
