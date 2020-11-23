<template>
    <ul :class="{'list-unstyled': !expanded}">
        <li v-for="author in config.contact.authors" :class="['mb-2', author.bold ? 'bold' : '']">
            <template v-if="author.link">
                <a :href="author.link" target="_blank" rel="noopener">
                    {{ author.name }}
                </a>
            </template>
            <template v-else>
                {{ author.name }}
            </template>
            <template v-if="author.pronouns">
                (<nuxt-link :to="author.pronounsLink">{{ author.pronouns }}</nuxt-link>)
                –
            </template>
            <template v-for="(link, area, index) in author.areas">
                <Spaceless>
                    <nuxt-link v-if="link && link.indexOf('/') === 0" :to="link">{{ area.replace(/_/g, ' ') }}</nuxt-link>
                    <a v-else-if="link" :href="link" target="_blank" rel="noopener">{{ area.replace(/_/g, ' ') }}</a>
                    <span v-else>{{ area.replace(/_/g, ' ') }}</span>
                    <span v-if="index < Object.keys(author.areas).length - 1">, </span>
                </Spaceless>
            </template>
            <br/>
            <nuxt-link v-if="author.profile" :to="`/@${author.profile}`" class="badge badge-light border">
                <Icon v="id-card"/>
                @{{author.profile}}
            </nuxt-link>
            <a v-if="author.website" :href="author.website" target="_blank" rel="noopener" class="badge badge-light border">
                <Icon v="globe"/>
                Blog
            </a>
            <a v-if="author.twitter" :href="'https://twitter.com/' + author.twitter" target="_blank" rel="noopener" class="badge badge-light border">
                <Icon v="twitter" set="b"/>
                Twitter
            </a>
            <a v-if="author.mail" :href="'mailto:' + author.mail" target="_blank" rel="noopener" class="badge badge-light border">
                <Icon v="envelope"/>
                Email
            </a>
        </li>
    </ul>
</template>

<script>
    export default {
        props: {
            expanded: { type: Boolean }
        },
    }
</script>

<style lang="scss" scoped>
    .bold {
        font-weight: bold;
    }
</style>
