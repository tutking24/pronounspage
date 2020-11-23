<template>
    <NotFound v-if="!content"/>
    <div v-else class="container blog-post">
        <div v-html="content"></div>
    </div>
</template>

<script>
    import { head } from "../src/helpers";

    export default {
        async asyncData({route}) {
            try {
                const content = (await import(`../locale/pl/blog/${route.params.slug}.md`)).default;
                const titleMatch = content.match('<h1[^>]*>([^<]+)</h1>');
                const title = titleMatch ? titleMatch[1] : null;
                const imgMatch = content.match('<img src="([^"]+)"[^>]*>');
                const img = imgMatch ? imgMatch[1] : null;

                return {
                    content,
                    title,
                    img,
                }
            } catch {
                return {};
            }
        },
        head() {
            return head({
                title: this.title,
                banner: this.img,
            });
        },
    };
</script>

<style lang="scss">
    .blog-post img {
        max-width: 100%;
    }
</style>
