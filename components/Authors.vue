<template>
    <ul class="list-unstyled">
        <li class="mb-2">
            <Icon v="collective-logo.svg"/>
            <nuxt-link :to="`/${config.contact.team.route}`">
                <T>contact.team.name</T>
            </nuxt-link>
        </li>
        <li v-if="authors === undefined">
            <Spinner/>
        </li>
        <template v-else>
            <li v-for="author in authors" class="mb-2">
                <Icon v="user"/>
                {{ author.footerName }}
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
