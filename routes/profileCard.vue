<template>
    <Profile v-if="profile" :user="user" :profile="profile" class="pb-3">
        <nuxt-link to="/">
            <h1 class="text-nowrap h5">
                <Icon v="tags"/>
                <T>title</T><span v-if="profile">/@{{user.username}}</span>
            </h1>
        </nuxt-link>
    </Profile>
    <NotFound v-else/>
</template>

<script>
    import { head } from "../src/helpers";

    export default {
        layout: 'basic',
        async asyncData({ app, route }) {
            return {
                user: await app.$axios.$get(`/profile/get/${encodeURIComponent(route.params.pathMatch)}`),
            };
        },
        computed: {
            profile() {
                for (let locale in this.user.profiles) {
                    if (locale === this.config.locale) {
                        return this.user.profiles[locale];
                    }
                }

                return null;
            },
        },
        head() {
            return head({
                title: `@${this.$route.params.pathMatch}`,
                banner: `api/banner/@${this.$route.params.pathMatch}.png`,
            });
        },
    }
</script>
