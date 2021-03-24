<template>
    <div v-if="config.sources.enabled && Object.keys(sources).length">
        <h2 class="h4">
            <nuxt-link :to="'/' + config.sources.route">
                <Icon v="books"/>
                <T>sources.headerLong</T>:
            </nuxt-link>
        </h2>

        <section v-for="(optionSources, option) in sources" v-if="optionSources">
            <h3 class="h5">
                <nuxt-link :to="'/' + option">
                    <span v-if="option.includes('&')">
                        <T>pronouns.alt.header</T>
                        <small>({{ option.replace(/&/g, glue) }})</small>
                    </span>
                    <span v-else-if="option">
                        {{ getPronoun(pronouns, option).description }}
                        <small>({{ getPronoun(pronouns, option).name(glue) }})</small>
                    </span>
                </nuxt-link>
            </h3>

            <SourceList :pronoun="pronoun" :sources="optionSources"/>
        </section>
    </div>
</template>

<script>
    import { pronouns } from "../src/data";
    import { getPronoun } from "../src/buildPronoun";

    export default {
        props: {
            pronoun: { },
            sources: { required: true },
        },
        data() {
            return {
                pronouns,
                getPronoun: getPronoun,
                glue: ' ' + this.$t('pronouns.or') + ' ',
            }
        }
    }
</script>
