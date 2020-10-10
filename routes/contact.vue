<template>
    <div class="container">
        <h2>
            <Icon v="comment-alt-smile"/>
            <T>contact.header</T>
        </h2>

        <section>
            <a v-for="link in [...config.contact.contacts, ...config.links.socials]" :key="link.url"
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

        <section>
            <h3>
                <Icon v="people-carry"/>
                <T>support.header</T>
            </h3>
            <p><T>support.description</T></p>
            <p>
                <a v-for="link in config.support.links" :key="link.url"
                   :href="link.url" target="_blank" rel="noopener"
                   class="btn btn-outline-primary border m-1">
                    <Icon :v="link.icon" :set="link.iconSet || 'l'"/>
                    {{link.headline}}
                </a>
            </p>
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
