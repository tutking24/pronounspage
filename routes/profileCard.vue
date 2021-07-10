<template>
    <Profile v-if="profile" :profile="profile" class="pb-3">
        <nuxt-link to="/">
            <h1 class="text-nowrap h5">
                <Icon v="tags"/>
                <T>title</T><span v-if="profile">/@{{profile.username}}</span>
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
                profiles: await app.$axios.$get(`/profile/get/${encodeURIComponent(route.params.pathMatch)}`),
            };
        },
        computed: {
            profile() {
                for (let locale in this.profiles) {
                    if (locale === this.config.locale) {
                        return this.profiles[locale];
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
