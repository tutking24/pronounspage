<template>
    <ul>
        <li v-for="pronoun in pronouns" :key="pronoun.canonicalName">
            <nuxt-link v-if="typeof pronoun === 'string'" :to="'/' + pronoun">
                <strong><Spelling>{{pronoun.replace(/&/g, ' ' + $t('pronouns.or') + ' ')}}</Spelling></strong>
            </nuxt-link>
            <nuxt-link v-else :to="addSlash('/' + pronoun.canonicalName)">
                <strong><Spelling>{{pronoun.name(glue)}}</Spelling></strong><small v-if="pronoun.smallForm">/<Spelling>{{pronoun.morphemes[pronoun.smallForm]}}</Spelling></small>
                –
                <small><Spelling>{{pronoun.description}}</Spelling></small>
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
