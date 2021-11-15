<template>
    <div class="columnist-wall row">
        <div v-for="post in posts" class="columnist-column col-12 col-sm-6 col-md-4 mb-3">
            <div class="card shadow">
                <nuxt-link v-if="post.hero" :to="`/blog/${post.slug}`" class="">
                    <img :src="post.hero" class="w-100"/>
                </nuxt-link>
                <nuxt-link :to="`/blog/${post.slug}`" class="card-body text-center h4 p-3 mb-0">
                    <Spelling :text="post.title"/>
                </nuxt-link>
                <div class="card-footer small">
                    <ul class="list-inline mb-0">
                        <li class="list-inline-item small">
                            <Icon v="calendar"/>
                            {{post.date}}
                        </li>
                        <li v-for="author in post.authors" class="list-inline-item">
                            <nuxt-link v-if="author.startsWith('@')" :to="`/${author}`" class="badge bg-light text-dark border">
                                <Icon v="collective-logo.svg" class="invertible"/>
                                {{author}}
                            </nuxt-link>
                            <span v-else class="badge bg-light text-dark border">
                                {{author}}
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Columnist from 'avris-columnist';

    export default {
        props: {
            posts: { required: true },
        },
        mounted() {
            if (!process.client) { return; }

            const columnist = new Columnist(this.$el);
            columnist.start();
        },
    };
</script>

<style lang="scss" scoped>
    .columnist-wall > .columnist-column {
        transition: margin-top .2s ease-in-out;
    }
</style>
