<template>
    <div v-if="config.sources.enabled && Object.keys(sources).length">
        <h2 class="h4">
            <nuxt-link :to="'/' + config.sources.route">
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

            <SourceList :names="optionSources"/>
        </section>
    </div>
</template>

<script>
    import { templates, sortSources } from "../src/data";
    import { getTemplate } from "../src/buildTemplate";

    export default {
        props: {
            sources: { required: true },
        },
        data() {
            return {
                templates: templates,
                getTemplate: getTemplate,
                glue: ' ' + this.$t('template.or') + ' ',
                sortSources,
            }
        }
    }
</script>
