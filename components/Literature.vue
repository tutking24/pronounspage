<template>
    <div v-if="Object.keys(sources).length">
        <h2 class="h4">
            <Icon v="books"/>
            Przykłady z literatury, prasy, filmów i seriali:
        </h2>

        <LiteratureMenu/>

        <section v-for="(optionSources, option) in sources">
            <h3 class="h5">
                <nuxt-link :to="'/' + option">
                    <span v-if="option.includes('&')">
                        Formy wymienne
                        <small>({{ option.replace(/&/g, ' lub ') }})</small>
                    </span>
                    <span v-else>
                        {{ getTemplate(templates, option).description }}
                        <small>({{ getTemplate(templates, option).name() }})</small>
                    </span>
                </nuxt-link>
            </h3>

            <ul class="list-unstyled">
                <li v-for="source in optionSources" class="my-2">
                    <Source :name="source"/>
                </li>
            </ul>
        </section>
    </div>
</template>

<script>
    import { templates } from "../src/data";
    import { getTemplate } from "../src/buildTemplate";

    export default {
        props: {
            sources: { required: true },
        },
        data() {
            return {
                templates: templates,
                getTemplate: getTemplate,
            }
        }
    }
</script>
