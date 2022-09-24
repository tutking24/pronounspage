<template>
    <Twemoji>
    <span>
        <strong v-if="opinion === 'yes'">
            <Tooltip :text="$t('profile.opinion.yes')">
                <Icon v="heart" set="s"/>
            </Tooltip>
            <nuxt-link v-if="link" :to="link"><Spelling :escape="escape" :text="word"/></nuxt-link>
            <span v-else><Spelling :escape="escape" :text="word"/></span>
        </strong>
        <span v-else-if="opinion === 'jokingly'">
            <Tooltip :text="$t('profile.opinion.jokingly')">
                <Icon v="grin-tongue"/>
            </Tooltip>
            <nuxt-link v-if="link" :to="link"><Spelling :escape="escape" :text="word"/></nuxt-link>
            <span v-else><Spelling :escape="escape" :text="word"/></span>
        </span>
        <span v-else-if="opinion === 'close'">
            <Tooltip :text="$t('profile.opinion.close')">
                <Icon v="user-friends"/>
            </Tooltip>
            <nuxt-link v-if="link" :to="link"><Spelling :escape="escape" :text="word"/></nuxt-link>
            <span v-else><Spelling :escape="escape" :text="word"/></span>
        </span>
        <span v-else-if="opinion === 'meh'">
            <Tooltip :text="$t('profile.opinion.meh')">
                <Icon v="thumbs-up"/>
            </Tooltip>
            <nuxt-link v-if="link" :to="link"><Spelling :escape="escape" :text="word"/></nuxt-link>
            <span v-else><Spelling :escape="escape" :text="word"/></span>
        </span>
        <span v-else-if="opinion === 'no'" class="text-muted small">
            <Tooltip :text="$t('profile.opinion.no')">
                <Icon v="thumbs-down"/>
            </Tooltip>
            <nuxt-link v-if="link" :to="link"><Spelling :escape="escape" :text="word"/></nuxt-link>
            <span v-else><Spelling :escape="escape" :text="word"/></span>
        </span>
    </span>
    </Twemoji>
</template>

<script>
    export default {
        props: {
            word: { required: true },
            opinion: { required: true },
            link: {},
            escape: { type: Boolean, 'default': () => true },
        },
    }
</script>
