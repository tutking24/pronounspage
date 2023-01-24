<template>
    <Profile v-if="profile" :user="user" :profile="profile" class="pb-3 mt-5" static>
        <nuxt-link to="/">
            <h1 class="text-nowrap h5">
                <Logo style="font-size: 1.3em;"/>
                <T>domain</T><span v-if="profile">/@{{user.username}}</span>
            </h1>
        </nuxt-link>
        <QrCode :url="`https://${$t('domain')}/@${user.username}`" style="display: inline-block; width: 80px; height: 80px; margin-inline-start: 1rem;"/>
    </Profile>
    <NotFound v-else/>
</template>

<script>
    import { head } from "../src/helpers";

    export default {
        layout: 'basic',
        async asyncData({ app, route }) {
            return {
                user: await app.$axios.$get(`/profile/get/${encodeURIComponent(route.params.pathMatch)}?version=2`),
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
