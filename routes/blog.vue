<template>
    <Page>
        <LinksNav/>
        <h2>
            <Icon v="pen-nib"/>
            <T>links.blog</T>
        </h2>
        <AdPlaceholder phkey="main-0" class="my-3"/>
        <BlogEntriesList :posts="posts" details/>
        <Separator icon="heart"/>
        <Support/>
        <section>
            <Share :title="$t('links.blog')"/>
        </section>
    </Page>
</template>

<script>
    import { head } from "../src/helpers";

    export default {
        async asyncData({app}) {
            return {
                posts: await app.$axios.$get(`/blog`),
            }
        },
        head() {
            return head({
                title: this.$t('links.blog'),
            });
        },
    };
</script>
