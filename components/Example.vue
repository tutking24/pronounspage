<template>
    <span>
        <span v-for="part in example[(example.isHonorific ? pronoun.isPluralHonorific(counter) : pronoun.isPlural(counter)) ? 'pluralParts' : 'singularParts']">
            <strong v-if="part.variable">{{pronoun.getMorpheme(part.str, counter)}}</strong>
            <span v-else>{{part.str}}</span>
        </span>
        <small v-if="link">
            (<nuxt-link :to="'/' + pronoun.canonicalName">{{ pronoun.canonicalName }}</nuxt-link>)
        </small>
    </span>
</template>

<script>
    export default {
        props: {
            example: { required: true },
            pronoun: { required: true },
            counter: { default: 0 },
            link: { type: Boolean },
        }
    }
</script>
