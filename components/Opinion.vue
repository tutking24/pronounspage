<template>
    <span>
        <strong v-if="opinion === 1">
            <img src="../node_modules/@fortawesome/fontawesome-pro/svgs/solid/heart.svg" :aria-label="$t('profile.opinion.yes')" class="icon invertible"/>
            <nuxt-link v-if="link" :to="link"><Spelling escape :text="word"/></nuxt-link>
            <span v-else><Spelling escape :text="word"/></span>
        </strong>
        <span v-else-if="opinion === 2">
            <Icon v="grin-tongue" :aria-label="$t('profile.opinion.jokingly')"/>
            <nuxt-link v-if="link" :to="link"><Spelling escape :text="word"/></nuxt-link>
            <span v-else><Spelling escape :text="word"/></span>
        </span>
        <span v-else-if="opinion === 0">
            <Icon v="thumbs-up" :aria-label="$t('profile.opinion.meh')"/>
            <nuxt-link v-if="link" :to="link"><Spelling escape :text="word"/></nuxt-link>
            <span v-else><Spelling escape :text="word"/></span>
        </span>
        <span v-else-if="opinion === -1" class="text-muted small">
            <Icon v="thumbs-down" :aria-label="$t('profile.opinion.no')"/>
            <nuxt-link v-if="link" :to="link"><Spelling escape :text="word"/></nuxt-link>
            <span v-else><Spelling escape :text="word"/></span>
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
