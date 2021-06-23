<template>
    <div>
        <LinksNav/>
        <h2>
            <Icon v="pen-nib"/>
            <T>links.blog</T>
        </h2>
        <div class="columnist-wall row" ref="posts">
            <div v-for="post in posts" class="columnist-column col-12 col-sm-6 col-md-4 mb-3">
                <div class="card shadow">
                    <nuxt-link v-if="post.hero" :to="`/blog/${post.slug}`" class="">
                        <img :src="post.hero" class="w-100"/>
                    </nuxt-link>
                    <nuxt-link :to="`/blog/${post.slug}`" class="card-body text-center h4 p-3 mb-0">
                        <span>{{post.title}}</span>
                    </nuxt-link>
                    <div class="card-footer small">
                        <ul class="list-inline mb-0">
                            <li class="list-inline-item small">
                                <Icon v="calendar"/>
                                {{post.date}}
                            </li>
                            <li v-for="author in post.authors" class="list-inline-item">
                                <a :href="`https://pronouns.page/@${author}`" class="badge bg-light text-dark border">
                                    @{{author}}
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <Support/>
        <section>
            <Share :title="$t('links.blog')"/>
        </section>
    </div>
</template>

<script>
    import { head } from "../src/helpers";
    import Columnist from 'avris-columnist';

    export default {
        async asyncData({app}) {
            return {
                posts: await app.$axios.$get(`/blog`),
            }
        },
        mounted() {
            if (!process.client) { return; }

            const columnist = new Columnist(this.$refs.posts);
            columnist.start();
        },
        head() {
            return head({
                title: this.$t('links.blog'),
            });
        },
    };
</script>

<style lang="scss" scoped>
    .columnist-wall > .columnist-column {
        transition: margin-top .2s ease-in-out;
    }
</style>
