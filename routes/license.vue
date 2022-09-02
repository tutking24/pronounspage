<template>
    <Page>
    <div class="blog-post">
        <Twemoji>
            <div v-html="content"></div>
        </Twemoji>

        <Separator icon="heart"/>
        <Support/>

        <section>
            <Share :title="title"/>
        </section>
    </div>
    </Page>
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
