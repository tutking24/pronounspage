<template>
    <span>
        <strong v-if="opinion > 0">
            <img src="../node_modules/@fortawesome/fontawesome-pro/svgs/solid/heart.svg" alt="" class="icon"/>
            <nuxt-link v-if="link" :to="link">{{ word }}</nuxt-link>
            <span v-else>{{ word }}</span>
        </strong>
        <span v-else-if="opinion < 0" class="text-muted small">
            <Icon v="thumbs-down"/>
            <nuxt-link v-if="link" :to="link">{{ word }}</nuxt-link>
            <span v-else>{{ word }}</span>
        </span>
        <span v-else>
            <Icon v="thumbs-up"/>
            <nuxt-link v-if="link" :to="link">{{ word }}</nuxt-link>
            <span v-else>{{ word }}</span>
        </span>
    </span>
</template>

<script>
    export default {
        props: {
            word: { required: true },
            opinion: { required: true },
            link: {},
        },
    }
</script>

<style lang="scss" scoped>
    img.icon {
        height: 1em;
        width: 1.25em;
        text-align: center;
    }
</style>
