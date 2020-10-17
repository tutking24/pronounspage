<template>
    <nuxt-link v-if="locale === config.locale" :to="link">
        <slot></slot>
    </nuxt-link>
    <a v-else :href="locales[locale].url + link">
        <slot></slot>
    </a>
</template>

<script>
    export default {
        props: {
            link: { required: true },
            locale:  { required: true },
        },
    };
</script>
