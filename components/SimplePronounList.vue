<template>
    <ul>
        <li v-for="pronoun in pronouns" :key="pronoun.canonicalName">
            <nuxt-link v-if="typeof pronoun === 'string'" :to="'/' + pronoun">
                <strong><Spelling :text="pronoun.replace(/&/g, ' ' + $t('pronouns.or') + ' ')"/></strong>
            </nuxt-link>
            <nuxt-link v-else :to="addSlash('/' + pronoun.canonicalName)">
                <strong><Spelling :text="pronoun.name(glue)"/></strong><small v-if="pronoun.smallForm">/<Spelling :text="pronoun.morphemes[pronoun.smallForm]"/></small>
                –
                <small><Spelling :text="pronoun.description"/></small>
            </nuxt-link>
            <NormativeBadge v-if="pronoun.normative"/>
        </li>
    </ul>
</template>

<script>
    export default {
        props: {
            pronouns: {},
        },
        data() {
            return {
                glue: ' ' + this.$t('pronouns.or') + ' ',
            }
        },
        methods: {
            addSlash(link) {
                return link + (['*', `'`].includes(link.substr(link.length - 1)) ? '/' : '');
            },
        }
    }
</script>
