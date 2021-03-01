<template>
    <NotFound v-if="!content"/>
    <div v-else class="blog-post">
        <div v-html="content"></div>
    </div>
</template>

<script>
    import { head } from "../src/helpers";

    export default {
        async asyncData({route}) {
            try {
                const content = (await import(`../data/blog/${route.params.slug}.md`)).default;
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
                return {
                    content: null,
                };
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
    @import "assets/variables";

    .blog-post {
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
