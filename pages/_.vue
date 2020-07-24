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
                        ({{selectedTemplate.description}})
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
                    <span v-for="part in example.parts[selectedTemplate.plural]">
                        <strong v-if="part.variable">{{selectedTemplate.morphemes[part.str]}}</strong>
                        <span v-else>{{part.str}}</span>
                    </span>
                </li>
            </ul>
        </section>

        <section>
            <Share :title="'Moje zaimki to: ' + selectedTemplate.name()"/>
        </section>

        <section v-if="templates[selectedTemplate.pronoun()] && templates[selectedTemplate.pronoun()].sources.length">
            <Literature :sources="templates[selectedTemplate.pronoun()].sources"/>
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
    import { examples, templates } from "~/src/data";
    import buildTemplate from "../src/buildTemplate";

    export default {
        data() {
            return {
                examples: examples,
                templates: templates,

                selectedTemplate: buildTemplate(this.$route.path.substr(1)),
            }
        },
        head() {
            if (!this.selectedTemplate) {
                return {};
            }

            const title = 'Moje zaimki to: ' + this.selectedTemplate.name();
            const banner = `${process.env.baseUrl}/banner${this.$route.path}.png`;

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
    }
</script>

<style lang="scss">

</style>
