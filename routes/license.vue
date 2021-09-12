<template>
    <div v-else class="blog-post">
        <div v-html="content"></div>

        <Separator icon="heart"/>

        <Support/>

        <section>
            <Share :title="title"/>
        </section>
    </div>
</template>

<script>
    import { head } from "../src/helpers";
    import parseMarkdown from '../src/parseMarkdown';

    export default {
        async asyncData() {
            return parseMarkdown((await import(`../LICENSE.md`)).default)
        },
        head() {
            return head({
                title: this.title,
                banner: this.img,
            });
        },
    };
</script>
