<template>
    <NotFound v-if="!selectedTemplate"/>
    <div class="container" v-else>
        <Homepage/>
        <h1>
            <Icon v="tag"/>
            Moje zaimki to:
        </h1>

        <section>
            <div class="alert alert-primary">
                <h2 class="text-center mb-0">
                    <strong>{{ selectedTemplate.name() }}</strong>
                </h2>
                <p class="h6 small text-center mb-0 mt-2" v-if="selectedTemplate.description">
                    <em>
                        ({{Array.isArray(selectedTemplate.description)
                            ? ('Formy wymienne: ' + selectedTemplate.description.join(' lub '))
                            : selectedTemplate.description
                        }})
                    </em>
                </p>
            </div>
        </section>

        <section>
            <h2 class="h4">
                <Icon v="file-signature"/>
                Przykłady użycia w zdaniu:
            </h2>

            <ul>
                <li v-for="example in examples" class="my-1">
                    <span v-for="part in example[(example.isHonorific ? selectedTemplate.pluralHonorific : selectedTemplate.plural) ? 'pluralParts' : 'singularParts']">
                        <strong v-if="part.variable">{{selectedTemplate.getMorpheme(part.str, counter)}}</strong>
                        <span v-else>{{part.str}}</span>
                    </span>
                </li>
            </ul>
        </section>

        <section>
            <h2 class="h4">
                <Icon v="spell-check"/>
                Odmiana:
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
                        <td>-{{ selectedTemplate.getMorpheme('verb_middle', counter) }}{{ selectedTemplate.plural ? 'śmy' : 'm'}}</td>
                        <td>-{{ selectedTemplate.getMorpheme('verb_middle', counter) }}{{ selectedTemplate.plural ? 'ście' : 'ś'}}</td>
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
            <Share :title="'Moje zaimki to: ' + selectedTemplate.name()"/>
        </section>

        <section v-if="Object.keys(sources).length">
            <Literature :sources="sources"/>
        </section>

        <Separator icon="info"/>
        <section class="mb-0">
            <h2 class="h4">
                <Icon v="info-circle"/>
                O co chodzi w tej stronie?
            </h2>
            <About/>
            <Homepage align="center"/>
        </section>
    </div>
</template>

<script>
    import { examples, templates, getSources } from "~/src/data";
    import { buildTemplate, getTemplate } from "../src/buildTemplate";

    export default {
        data() {
            return {
                examples: examples,
                templates: templates,
                getTemplate: getTemplate,

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
            if (!this.selectedTemplate) {
                return {};
            }

            const title = 'Moje zaimki to: ' + this.selectedTemplate.name();
            const banner = `${process.env.baseUrl}/banner${this.$route.path.replace(/\/$/, '')}.png`;

            return {
                title: title,
                meta: [
                    { hid: 'og:title', property: 'og:title', content: title },
                    { hid: 'twitter:title', property: 'twitter:title', content: title },

                    { hid: 'og:logo', property: 'og:logo', content: banner },
                    { hid: 'twitter:image', property: 'twitter:image', content: banner },
                ],
            }
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
