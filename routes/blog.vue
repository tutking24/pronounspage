<template>
    <div>
        <LinksNav/>
        <h2>
            <Icon v="pen-nib"/>
            <T>links.blog</T>
        </h2>
        <BlogEntriesList :posts="posts"/>
        <Support/>
        <section>
            <Share :title="$t('links.blog')"/>
        </section>
    </div>
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
