<template>
    <NotFound v-if="!selectedTemplate"/>
    <div v-else class="container">
        <h2>
            <Icon v="tag"/>
            <T>template.intro</T>:
        </h2>

        <section>
            <div class="alert alert-primary">
                <h2 class="text-center mb-0">
                    <strong v-if="nameOptions.length === 1">
                        {{ selectedTemplate.name(glue) }}
                    </strong>
                    <template v-else>
                        <template v-for="(nameOption, i) in nameOptions">
                            <nuxt-link :to="'/' + addSlash(nameOption)">
                                <strong>
                                    {{ nameOption }}
                                </strong>
                            </nuxt-link>
                            <span v-if="i < nameOptions.length - 1">{{ glue }}</span>
                        </template>
                    </template>
                </h2>
                <p class="h6 small text-center mb-0 mt-2" v-if="selectedTemplate.description">
                    <em>
                        ({{Array.isArray(selectedTemplate.description)
                            ? ($t('template.alt.header') + ': ' + selectedTemplate.description.join(glue))
                            : selectedTemplate.description
                        }})
                    </em>
                </p>
            </div>
        </section>

        <section>
            <h2 class="h4">
                <Icon v="file-signature"/>
                <T>template.examples</T>:
            </h2>

            <ul>
                <li v-for="example in examples" class="my-1">
                    <Example :example="example" :template="selectedTemplate" :counter="counter"/>
                </li>
            </ul>
        </section>

        <GrammarTables :selectedTemplate="selectedTemplate" :counter="counter"/>

        <section v-if="selectedTemplate.history">
            <div class="alert alert-info" v-for="part in selectedTemplate.history.split('@')">
                <Icon v="info-circle"/>
                <LinkedText :text="part"/>
            </div>
        </section>

        <section v-if="templateGroup && templateGroup.group.description">
            <ul class="list-group mt-4">
                <li class="list-group-item">
                    <p class="h5">
                        {{ templateGroup.group.name }}
                    </p>
                    <div class="small my-1">
                        <Icon v="info-circle"/>
                        <em v-html="templateGroup.group.description"></em>
                    </div>
                    <ul class="list-unstyled">
                        <li v-for="template in templateGroup.groupTemplates" :key="template.canonicalName">
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
                <nuxt-link to="/" class="list-group-item list-group-item-action text-center">
                    <Icon v="ellipsis-h-alt"/>
                </nuxt-link>
            </ul>
        </section>

        <section>
            <Share :title="`${$t('template.intro')}: ${selectedTemplate.name(glue)}`"/>
        </section>

        <section v-if="Object.keys(sources).length">
            <Literature :sources="sources"/>
        </section>

        <Separator icon="info"/>
        <section class="mb-0">
            <h2 class="h4">
                <Icon v="info-circle"/>
                <T>home.whatisit</T>:
            </h2>
            <T>home.about</T>
            <Homepage align="center"/>
        </section>
    </div>
</template>

<script>
    import { examples, templates, getSources, templateLibrary } from "~/src/data";
    import { buildTemplate } from "../src/buildTemplate";
    import { head } from "../src/helpers";
    import GrammarTables from "../data/templates/GrammarTables";
    import LinkedText from "../components/LinkedText";

    export default {
        components: {LinkedText, GrammarTables },
        data() {
            const selectedTemplate = this.config.template.enabled
                ? buildTemplate(templates, this.$route.path.substr(1).replace(/\/$/, ''))
                : null;

            return {
                examples,
                templates,
                glue: ' ' + this.$t('template.or') + ' ',

                selectedTemplate,
                nameOptions: selectedTemplate ? selectedTemplate.nameOptions() : [],
                templateGroup: templateLibrary.find(selectedTemplate),

                counter: 0,
            }
        },
        mounted() {
            if (process.client) {
                setInterval(_ => this.counter++, 1000);
            }
        },
        head() {
            return this.selectedTemplate ? head({
                title: `${this.$t('template.intro')}: ${this.selectedTemplate.name(this.glue)}`,
                banner: `api/banner${this.$route.path.replace(/\/$/, '')}.png`,
            }) : {};
        },
        methods: {
            addSlash(link) {
                return link + (link.substr(link.length - 1) === '*' ? '/' : '');
            },
        },
        computed: {
            sources() {
                return getSources(this.selectedTemplate);
            },
        },
    }
</script>
