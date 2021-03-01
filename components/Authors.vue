<template>
    <ul class="list-unstyled">
        <li class="mb-2">
            <Icon v="collective-logo.svg"/>
            <nuxt-link :to="`/${config.contact.team.route}`">
                <T>contact.team.name</T>
            </nuxt-link>
        </li>
        <li v-for="author in config.contact.authors || []" class="mb-2">
            <Icon :v="author.group ? 'users' : 'user'"/>
            <a :href="author.link" target="_blank" rel="noopener">
                <Spelling>{{author.name}}</Spelling>
            </a>
        </li>
        <li v-if="authors === undefined">
            <Spinner/>
        </li>
        <template v-else>
            <li v-for="author in authors" class="mb-2">
                <Icon v="user"/>
                <Spelling>{{ author.footerName }}</Spelling>
                <nuxt-link :to="`/@${author.username}`" class="badge bg-light text-dark border">
                    @{{author.username}}
                </nuxt-link>
                <br/>
                <small>
                    {{author.footerAreas.replace(/,/g, ', ')}}
                </small>
            </li>
        </template>
    </ul>
</template>

<script>
    export default {
        data() {
            return {
                authors: undefined,
            }
        },
        async mounted() {
            this.authors = await this.$axios.$get(`/admin/list/footer`);
        },
    }
</script>
