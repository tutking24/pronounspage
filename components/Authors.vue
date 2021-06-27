<template>
    <ul class="list-unstyled">
        <li class="mb-2">
            <Icon v="collective-logo.svg" class="invertible"/>
            <nuxt-link :to="`/${config.contact.team.route}`">
                <T>contact.team.name</T>
            </nuxt-link>
        </li>
        <li v-if="authors === undefined">
            <Spinner/>
        </li>
        <template v-else>
            <li v-for="author in authors" class="mb-2">
                <Icon :v="author.group ? 'users' : 'user'"/>
                <a v-if="author.link" :href="author.link" target="_blank" rel="noopener">
                    <Spelling :text="author.footerName"/>
                </a>
                <span v-else>
                    <Spelling :text="author.footerName"/>
                </span>
                <nuxt-link v-if="author.username" :to="`/@${author.username}`" class="badge bg-light text-dark border">
                    @{{author.username}}
                </nuxt-link>
                <br v-if="author.footerAreas"/>
                <small v-if="author.footerAreas">
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
