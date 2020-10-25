<template>
    <span>
        <strong v-if="opinion === 1">
            <img src="../node_modules/@fortawesome/fontawesome-pro/svgs/solid/heart.svg" alt="" class="icon"/>
            <nuxt-link v-if="link" :to="link">{{ word }}</nuxt-link>
            <span v-else>{{ word }}</span>
        </strong>
        <span v-else-if="opinion === 0">
            <Icon v="thumbs-up"/>
            <nuxt-link v-if="link" :to="link">{{ word }}</nuxt-link>
            <span v-else>{{ word }}</span>
        </span>
        <span v-else-if="opinion === -1" class="text-muted small">
            <Icon v="thumbs-down"/>
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
