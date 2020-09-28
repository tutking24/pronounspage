<template>
    <div v-if="Object.keys(sources).length">
        <h2 class="h4">
            <nuxt-link to="/literatura">
                <Icon v="books"/>
                <T>sources.headerLong</T>:
            </nuxt-link>
        </h2>

        <section v-for="(optionSources, option) in sources">
            <h3 class="h5">
                <nuxt-link :to="'/' + option">
                    <span v-if="option.includes('&')">
                        <T>template.alt.header</T>
                        <small>({{ option.replace(/&/g, glue) }})</small>
                    </span>
                    <span v-else>
                        {{ getTemplate(templates, option).description }}
                        <small>({{ getTemplate(templates, option).name(glue) }})</small>
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
