<template>
    <ul class="list-unstyled">
        <li class="mb-2">
            <nuxt-link :to="`/${config.contact.team.route}`" :class="bigteam ? 'btn btn-outline-primary border m-1' : ''">
                <Icon v="collective-logo.svg" :class="['invertible', bigteam ? 'hover-invertible' : '']"/>
                <T>contact.team.name</T>
            </nuxt-link>
            <br/>
            <small><T>contact.team.description</T></small>
        </li>
        <li v-if="authors === undefined">
            <Spinner/>
        </li>
        <template v-else>
            <li v-for="author in authors" class="mb-2">
                <Icon :v="author.group ? 'users' : 'user'"/>
                <a v-if="author.link" :href="author.link" target="_blank" rel="noopener">
                    <Spelling :text="convertName(author.footerName)"/>
                </a>
                <span v-else>
                    <Spelling :text="convertName(author.footerName)"/>
                </span>
                <nuxt-link v-if="author.username" :to="`/@${author.username}`" class="badge bg-light text-dark border">
                    @{{author.username}}
                </nuxt-link>
                <br v-if="author.footerAreas"/>
                <small v-if="author.footerAreas">
                    <Spelling :text="author.footerAreas.replace(/,/g, ', ')"/>
                </small>
            </li>
        </template>
    </ul>
</template>

<script>
    import spelling from "../plugins/spelling";

    export default {
        mixins: [ spelling ],
        props: {
            bigteam: {type: Boolean},
        },
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
