<template>
    <div class="container">
        <h2>
            <Icon v="comment-alt-smile"/>
            <T>contact.header</T>
        </h2>

        <section>
            <a v-for="link in [...config.contact.contacts, ...config.links.socials]"
               :href="link.url" target="_blank" rel="noopener"
               class="btn btn-outline-primary border m-1">
                <Icon :v="link.icon" :set="link.iconSet || 'l'"/>
                {{link.headline}}
            </a>
        </section>

        <section>
            <h3>
                <Icon v="users"/>
                <T>contact.authors</T>
            </h3>
            <Authors expanded/>
        </section>
    </div>
</template>

<script>
    import { head } from "../src/helpers";
    import Icon from "../components/Icon";

    export default {
        components: {Icon},
        head() {
            return head({
                title: this.$t('contact.header'),
            });
        },
    }
</script>
