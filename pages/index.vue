<template>
    <div class="container">
        <h1>
            <Icon v="tags"/>
            Zaimki.pl
        </h1>

        <section>
            <About/>
        </section>

        <Separator icon="link"/>

        <section>
            <p>
                Wybierz sposród najpopularniejszych:
            </p>

            <nuxt-link v-for="(template, pronoun) in templates" :to="'/' + pronoun" :key="pronoun" class="btn btn-outline-primary m-2 btn-md-lg">
                {{template.name()}}
            </nuxt-link>
        </section>

        <section>
            <p>
                Lub dopasuj bardziej szczegółowo:
            </p>

            <a v-if="!customise" href="#" @click.prevent="customise = true" class="btn btn-outline-primary btn-lg btn-block">
                <Icon v="sliders-h-square"/>
                Kreator
            </a>
            <div v-else class="card mb-5">
                <div class="card-header">
                    <Icon v="sliders-h-square"/>
                    Kreator
                </div>
                <div class="card-body" v-if="customise">
                    <div class="card-title border-bottom pb-3">
                        <ul class="list-inline d-inline mb-0">
                            <li class="list-inline-item pt-1 h5">
                                Sugestie:
                            </li>
                            <li class="list-inline-item" v-for="(template, pronoun) in templates">
                                <button :class="['btn', template.name() === selectedTemplate.name() ? 'btn-primary' : 'btn-outline-primary', 'btn-sm']"
                                        @click="selectedTemplate = templates[pronoun].clone()"
                                >
                                    {{template.name()}}
                                </button>
                            </li>
                        </ul>
                    </div>

                    <div class="alert alert-primary">
                        <p class="h3 mb-0 text-center">
                            {{ selectedTemplate.name() }}
                            <br/>
                            <input v-model="selectedTemplate.description"
                                   class="form-control form-input p-0 form-control-sm"
                                   :size="selectedTemplate.description.length + 3"
                                   maxlength="48"
                            />
                        </p>
                    </div>

                    <p>
                        Przykłady użycia w zdaniu:
                    </p>
                    <template v-for="isHonorific in [false, true]">
                        <ul>
                            <li v-for="example in examples" v-if="example.isHonorific === isHonorific">
                                <span v-for="part in example[(isHonorific ? selectedTemplate.pluralHonorific : selectedTemplate.plural) ? 'pluralParts' : 'singularParts']">
                                    <input v-if="part.variable" v-model="selectedTemplate.morphemes[part.str]"
                                           :class="['form-control form-input p-0', {'active': selectedMorpheme === part.str}]"
                                           :size="selectedTemplate.morphemes[part.str] ? selectedTemplate.morphemes[part.str].length : 0"
                                           maxlength="7"
                                           @focus="selectedMorpheme = part.str"
                                           @blur="selectedMorpheme = ''"
                                    />
                                    <span v-else>{{part.str}}</span>
                                </span>
                            </li>
                        </ul>
                        <div class="my-3">
                            <div class="custom-control custom-switch" v-if="isHonorific">
                                <input type="checkbox" class="custom-control-input" id="pluralHonorific" v-model="selectedTemplate.pluralHonorific">
                                <label class="custom-control-label" for="pluralHonorific">Liczba mnoga <Icon v="level-up"/></label>
                            </div>
                            <div class="custom-control custom-switch" v-else>
                                <input type="checkbox" class="custom-control-input" id="plural" v-model="selectedTemplate.plural">
                                <label class="custom-control-label" for="plural">Liczba mnoga <Icon v="level-up"/></label>
                            </div>
                        </div>
                    </template>
                </div>
                <div class="card-footer" v-if="customise && link">
                    <LinkInput :link="link"/>
                </div>
                <div class="card-body border-top" v-if="getTemplate(templates, selectedTemplate.name()) && getTemplate(templates, selectedTemplate.name()).sources.length">
                    <Literature :sources="getTemplate(templates, selectedTemplate.name()).sources"/>
                </div>
            </div>
        </section>

        <Separator icon="bookmark"/>

        <section>
            <h2 class="h3 mb-3">
                <Icon v="bookmark"/>
                Dodatkowe materiały:
            </h2>
            <ul class="list-unstyled">
                <li class="my-2">
                    <Icon v="globe-europe"/>
                    <a href="https://pronoun.is/" target="_blank" rel="noopener">
                        Pronoun.is
                    </a>
                    – anglojęzyczna inspiracja dla tej strony.
                </li>
                <li class="my-2">
                    <Icon v="books"/>
                    <nuxt-link to="/literatura">
                        Niebinarna polszczyzna w literaturze, prasie, filmach i serialach
                    </nuxt-link>
                    <!-- https://docs.google.com/document/d/1ddgYxlZk0S6sDx7eVCMMXHQEvtXpDztpYQxomALXBXM/edit -->
                    – przykłady zebrane przez Pawła Dembowskiego.
                </li>
                <li class="my-2">
                    <Icon v="comment-alt-edit"/>
                    <a href="https://avris.it/blog/czemu-ka%C5%BCdy-powinien-mie%C4%87-zaimki-w-bio" target="_blank" rel="noopener">
                        Czemu KAŻDY powinien mieć zaimki w bio
                    </a>
                </li>
                <li class="my-2">
                    <Icon v="comment-alt-edit"/>
                    <a href="https://avris.it/blog/genderneutralizacja-polszczyzny" target="_blank" rel="noopener">
                        Genderneutralizacja polszczyzny?
                    </a>
                    – mój artykuł opisujący, dlaczego język neutralny płciowo jest ważny,
                    i zbierający pomysły na stworzenie takiego.
                </li>
                <li class="my-2">
                    <Icon v="comment-alt-edit"/>
                    <a href="https://www.przemyslenia-maniaka.pl/2019/11/maniak-marudzi-27-niebinarne-tumaczenia.html" target="_blank" rel="noopener">
                        Maniak marudzi #27: Niebinarne tłumaczenia
                    </a>
                    – artykuł pokazujący, że „nie da się przetłumaczyć they/them” na polski
                    to tylko wymówka.
                </li>
            </ul>
        </section>
    </div>
</template>

<script>
    import { examples, templates } from "~/src/data";
    import Compressor from "../src/compressor";
    import { getTemplate } from "../src/buildTemplate";

    export default {
        data() {
            return {
                examples: examples,
                templates: templates,
                getTemplate: getTemplate,

                selectedTemplate: templates['on'].clone(),
                selectedMorpheme: '',

                customise: false,
            }
        },
        computed: {
            usedBase() {
                const name = this.selectedTemplate.name();
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
                const base = this.templates[this.selectedTemplate.morphemes.pronoun_n];

                return base
                    ? Compressor.compress(this.selectedTemplate.toArray(), base.toArray()).join(',')
                    : this.selectedTemplate.toString();
            },
            link() {
                if (!this.selectedTemplate.pronoun()) {
                    return null;
                }
                return process.env.baseUrl + '/' + (this.usedBaseEquals ? this.usedBase : this.longLink);
            },
        },
    }
</script>

<style lang="scss">
    @import "assets/style";

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
