<template>
    <nuxt-link v-if="locale === config.locale" :to="link">
        <slot></slot>
    </nuxt-link>
    <a v-else-if="locale === 'external'" :href="link" target="_blank" rel="noopener">
        <slot></slot>
    </a>
    <a v-else :href="(locale === '_' || locales[locale] === undefined ? homeLink : locales[locale].url) + link">
        <slot></slot>
    </a>
</template>

<script>
    export default {
        props: {
            link: { required: true },
            locale:  { required: true },
        },
        data() {
            return {
                homeLink: process.env.HOME_URL,
            }
        }
    };
</script>
