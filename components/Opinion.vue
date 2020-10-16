<template>
    <span>
        <Icon :v="icon()"/>
        <strong v-if="opinion > 0">
            <nuxt-link v-if="link" :to="link">{{ word }}</nuxt-link>
            <span v-else>{{ word }}</span>
        </strong>
        <span v-else-if="opinion < 0" class="text-muted">
            <nuxt-link v-if="link" :to="link">{{ word }}</nuxt-link>
            <span v-else>{{ word }}</span>
        </span>
        <span v-else>
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
        methods: {
            icon() {
                const opinion = parseInt(this.opinion);
                if (opinion > 0) {
                    return 'heart';
                } else if (opinion === 0) {
                    return 'thumbs-up';
                }
                return 'thumbs-down';
            }
        }
    }
</script>
