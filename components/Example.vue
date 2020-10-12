<template>
    <span>
        <span v-for="part in example[(example.isHonorific ? template.isPluralHonorific(counter) : template.isPlural(counter)) ? 'pluralParts' : 'singularParts']">
            <strong v-if="part.variable">{{template.getMorpheme(part.str, counter)}}</strong>
            <span v-else>{{part.str}}</span>
        </span>
        <small v-if="link">
            (<nuxt-link :to="'/' + template.canonicalName">{{ template.canonicalName }}</nuxt-link>)
        </small>
    </span>
</template>

<script>
    export default {
        props: {
            example: { required: true },
            template: { required: true },
            counter: { default: 0 },
            link: { type: Boolean },
        }
    }
</script>
