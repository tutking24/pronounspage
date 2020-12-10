<template>
    <ul>
        <li v-for="pronoun in pronouns" :key="pronoun.canonicalName">
            <nuxt-link v-if="typeof pronoun === 'string'" :to="'/' + pronoun">
                <strong>{{pronoun.replace(/&/g, ' ' + $t('pronouns.or') + ' ')}}</strong>
            </nuxt-link>
            <nuxt-link v-else :to="addSlash('/' + pronoun.canonicalName)">
                <strong>{{pronoun.name(glue)}}</strong><small v-if="pronoun.smallForm">/{{pronoun.morphemes[pronoun.smallForm]}}</small>
                –
                <small>{{pronoun.description}}</small>
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
                return link + (link.substr(link.length - 1) === '*' ? '/' : '');
            },
        }
    }
</script>
