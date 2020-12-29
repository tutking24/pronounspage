<template>
    <ul :class="{'list-unstyled': !expanded}">
        <li v-for="author in config.contact.authors" class="mb-2">
            <Icon v-if="!expanded" :v="author.group ? 'users' : 'user'"/>
            <a :href="author.link" target="_blank" rel="noopener">
                {{ author.name }}
            </a>
            <nuxt-link v-if="author.profile" :to="`/@${author.profile}`" class="badge badge-light border">
                @{{author.profile}}
            </nuxt-link>
            <br v-if="author.areas && Object.keys(author.areas).length"/>
            <small v-for="(link, area, index) in author.areas">
                <Spaceless>
                    <nuxt-link v-if="link && link.indexOf('/') === 0" :to="link">{{ area.replace(/_/g, ' ') }}</nuxt-link>
                    <a v-else-if="link" :href="link" target="_blank" rel="noopener">{{ area.replace(/_/g, ' ') }}</a>
                    <span v-else>{{ area.replace(/_/g, ' ') }}</span>
                    <span v-if="index < Object.keys(author.areas).length - 1">, </span>
                </Spaceless>
            </small>
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
