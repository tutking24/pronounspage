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

        <section>
            <h2 class="h4">
                <Icon v="spell-check"/>
                <T>template.declension</T>:
            </h2>

            <div class="table-responsive">
                <table class="table table-sm">
                    <thead>
                    <tr>
                        <th>Mianownik</th>
                        <th>Dopełniacz</th>
                        <th>Celownik</th>
                        <th>Biernik</th>
                        <th>Narzędnik</th>
                        <th>Miejscownik</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>{{ selectedTemplate.getMorpheme('pronoun_n', counter) }}</td>
                        <td>{{ selectedTemplate.getMorpheme('pronoun_g', counter) }} / {{ selectedTemplate.getMorpheme('pronoun_g_acc', counter) }}</td>
                        <td>{{ selectedTemplate.getMorpheme('pronoun_d', counter) }}</td>
                        <td>{{ selectedTemplate.getMorpheme('pronoun_a', counter) }}</td>
                        <td>{{ selectedTemplate.getMorpheme('pronoun_i', counter) }}</td>
                        <td>{{ selectedTemplate.getMorpheme('pronoun_l', counter) }}</td>
                    </tr>
                    </tbody>
                </table>
            </div>

            <div class="table-responsive">
                <table class="table table-sm">
                    <thead>
                    <tr>
                        <th>1 os.</th>
                        <th>2 os.</th>
                        <th>3 os.</th>
                        <th>Przymiotniki</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>-{{ selectedTemplate.getMorpheme('verb_middle_inter', counter) }}{{ selectedTemplate.plural ? 'śmy' : 'm'}}</td>
                        <td>-{{ selectedTemplate.getMorpheme('verb_middle_inter', counter) }}{{ selectedTemplate.plural ? 'ście' : 'ś'}}</td>
                        <td>-{{ selectedTemplate.getMorpheme('verb_end_about', counter) }}</td>
                        <td>-{{ selectedTemplate.getMorpheme('adjective_n', counter) }}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </section>

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

    export default {
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
                title: 'Moje zaimki to: ' + this.selectedTemplate.name(this.glue),
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

<style lang="scss">

</style>
