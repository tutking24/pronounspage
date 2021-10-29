<template>
    <span>
        <strong v-if="opinion === 1">
            <Tooltip :text="$t('profile.opinion.yes')">
                <img src="../node_modules/@fortawesome/fontawesome-pro/svgs/solid/heart.svg" class="icon invertible"/>
            </Tooltip>
            <nuxt-link v-if="link" :to="link"><Spelling escape :text="word"/></nuxt-link>
            <span v-else><Spelling escape :text="word"/></span>
        </strong>
        <span v-else-if="opinion === 2">
            <Tooltip :text="$t('profile.opinion.jokingly')">
                <Icon v="grin-tongue"/>
            </Tooltip>
            <nuxt-link v-if="link" :to="link"><Spelling escape :text="word"/></nuxt-link>
            <span v-else><Spelling escape :text="word"/></span>
        </span>
        <span v-else-if="opinion === 3">
            <Tooltip :text="$t('profile.opinion.close')">
                <Icon v="user-friends"/>
            </Tooltip>
            <nuxt-link v-if="link" :to="link"><Spelling escape :text="word"/></nuxt-link>
            <span v-else><Spelling escape :text="word"/></span>
        </span>
        <span v-else-if="opinion === 0">
            <Tooltip :text="$t('profile.opinion.meh')">
                <Icon v="thumbs-up"/>
            </Tooltip>
            <nuxt-link v-if="link" :to="link"><Spelling escape :text="word"/></nuxt-link>
            <span v-else><Spelling escape :text="word"/></span>
        </span>
        <span v-else-if="opinion === -1" class="text-muted small">
            <Tooltip :text="$t('profile.opinion.no')">
                <Icon v="thumbs-down"/>
            </Tooltip>
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
