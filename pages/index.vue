<template>
    <div class="container">
        <h2>
            <Icon v="tags"/>
            Skąd potrzeba niebinarnych zaimków?
        </h2>

        <section>
            <About/>
        </section>

        <section>
            <Share/>
        </section>

        <Separator icon="link"/>

        <section>
            <h2>
                <Icon v="tags"/>
                Propozycje form
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
                                <strong>{{template.replace(/&/g, ' lub ')}}</strong>
                            </nuxt-link>
                            <nuxt-link v-else :to="addSlash('/' + template.canonicalName)">
                                <strong>{{template.name()}}</strong>
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
                        Wygeneruj link do form wymiennych
                    </a>
                    <div v-else class="card">
                        <div class="card-header">
                            <Icon v="sliders-h-square"/>
                            Formy wymienne:
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
                        Generator form
                    </p>
                    <p>
                        Możesz także użyć poniższego narzędzia, w którym uzupełnisz luki w zdaniach
                        zgodnie z formami, których używasz, by wygenerować gotowy do udostępniania innym link.
                    </p>
                    <a v-if="!customise" href="#" @click.prevent="customise = true" class="btn btn-outline-primary btn-block">
                        <Icon v="sliders-h-square"/>
                        Pokaż generator
                    </a>
                    <div v-else class="card mb-5">
                        <div class="card-header">
                            <Icon v="sliders-h-square"/>
                            Wygeneruj link
                        </div>
                        <div class="card-body">
                            <div class="card-title border-bottom pb-3">
                                <ul class="list-inline d-inline mb-0">
                                    <li class="list-inline-item pt-1 h5">
                                        Na podstawie:
                                    </li>
                                    <li class="list-inline-item" v-for="(template, pronoun) in templates">
                                        <button :class="['btn', template.name() === selectedTemplate.name() ? 'btn-primary' : 'btn-outline-primary', 'btn-sm', 'my-1']"
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
                                        <input type="checkbox" class="custom-control-input" id="pluralHonorific" v-model="selectedTemplate.pluralHonorific">
                                        <label class="custom-control-label" for="pluralHonorific">Liczba mnoga <Icon v="level-up"/></label>
                                    </div>
                                    <div class="custom-control custom-switch" v-else>
                                        <input type="checkbox" class="custom-control-input" id="plural" v-model="selectedTemplate.plural">
                                        <label class="custom-control-label" for="plural">Liczba mnoga <Icon v="level-up"/></label>
                                    </div>
                                </div>
                            </template>
                            <p class="small">
                                <Icon v="info-circle"/>
                                Możesz tu również wpisać formy wymienne w każdym polu z osobna, np. <code>jego&jej</code> = „jego” lub „jej”.
                            </p>
                            <div class="alert alert-warning">
                                <p class="mb-0 small">
                                    <Icon v="exclamation-triangle"/>
                                    Strona jest w wersji βeta!
                                    Przykłady, formy gramatyczne i linki mogą się jeszcze mocno zmienić!
                                    Jeśli masz jakieś sugestie lub uwagi, daj mi proszę znać
                                    <a href="https://twitter.com/AvrisIT" target="_blank" rel="noopener">na Twitterze</a>
                                    lub
                                    <a href="mailto:andrea@avris.it" target="_blank" rel="noopener">przez maila</a>.
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
                        <nuxt-link to="/dowolne">Dowolne zaimki</nuxt-link>
                    </p>
                    <p>
                        Choć dla wielu osób niezmiernie ważne jest, by używać wobec nich konkretnych zaimków,
                        innym nie przeszkadza zwracanie się w dowolny sposób
                        – o ile wiadomo z kontekstu, że to o nich mowa.
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
    import Compressor from "../src/compressor";
    import { getTemplate } from "../src/buildTemplate";

    export default {
        data() {
            return {
                examples: examples,
                templates: templates,
                getTemplate: getTemplate,
                templateLibrary: templateLibrary,

                selectedTemplate: templates['on'].clone(),
                selectedMorpheme: '',

                customiseMultiple: false,
                multiple: ['on', 'ona'],

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
                return this.addSlash(process.env.baseUrl + '/' + (this.usedBaseEquals ? this.usedBase : this.longLink));
            },
            linkMultiple() {
                if (!this.multiple.length) {
                    return null;
                }

                return this.addSlash(process.env.baseUrl + '/' + this.multiple.join('&'));
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
            }
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
