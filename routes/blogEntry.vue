<template>
    <NotFound v-if="!content"/>
    <div v-else class="blog-post">
        <LinksNav v-if="config.links.split"/>
        <p v-else>
            <router-link :to="'/' + config.links.blogRoute" v-if="config.links.blog">
                <Icon v="pen-nib"/>
                <T>links.blog</T>
            </router-link>
        </p>

        <Spelling v-if="disableTwemoji" :text="content"/>
        <Twemoji v-else>
            <Spelling :text="content"/>
        </Twemoji>

        <div class="d-print-none">
            <Separator icon="heart"/>
            <Support/>
            <section>
                <Share :title="title"/>
            </section>
        </div>
    </div>
</template>

<script>
    import { head } from "../src/helpers";
    import parseMarkdown from '../src/parseMarkdown';

    export default {
        data() {
            return {
                selGroup: 'general',
            }
        },
        async asyncData({route}) {
            return parseMarkdown((await import(`../data/blog/${route.params.slug || route.meta[0].slug}.md`)).default);
        },
        head() {
            return head({
                title: this.title,
                description: this.intro,
                banner: this.img,
            });
        },
    };
</script>

<style lang="scss">
    @import "assets/variables";

    .blog-post {
        hyphens: auto;
        text-align: justify;

        img {
            max-width: 100%;
        }

        figure {
            width: 100%;
            max-width: 24rem;
            padding: $spacer;
            img {
                width: 100%;
            }
            figcaption {
                margin-top: $spacer / 2;
                font-size: $small-font-size;
            }
        }

        .forms-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(18rem, 3fr));
            grid-gap: $spacer;
            justify-items: center;
            figure {
                padding: 0;
                figcaption {
                    font-size: 90%;
                }
            }
        }
    }
</style>
