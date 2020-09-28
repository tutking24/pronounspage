<template>
    <NotFound v-if="!selectedTemplate"/>
    <div class="container" v-else>
        <h2>
            <Icon v="tag"/>
            <T>template.intro</T>:
        </h2>

        <section>
            <div class="alert alert-primary">
                <h2 class="text-center mb-0">
                    <strong>{{ selectedTemplate.name(glue) }}</strong>
                </h2>
                <p class="h6 small text-center mb-0 mt-2" v-if="selectedTemplate.description">
                    <em>
                        ({{Array.isArray(selectedTemplate.description)
                            ? ('Formy wymienne: ' + selectedTemplate.description.join(glue))
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
                <span v-html="part"></span>
            </div>
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
    import { examples, templates, getSources } from "~/src/data";
    import { buildTemplate } from "../src/buildTemplate";
    import { head } from "../src/helpers";
    import GrammarTables from "../data/GrammarTables";

    export default {
        components: { GrammarTables },
        data() {
            return {
                examples: examples,
                templates: templates,
                glue: ' ' + this.$t('template.or') + ' ',

                selectedTemplate: buildTemplate(templates, this.$route.path.substr(1).replace(/\/$/, '')),

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
                banner: `banner${this.$route.path.replace(/\/$/, '')}.png`,
            }) : {};
        },
        computed: {
            sources() {
                return getSources(this.selectedTemplate);
            },
        },
    }
</script>
