<template>
    <Page>
    <NotFound v-if="!$isGranted('users')"/>
    <div v-else>
        <p>
            <nuxt-link to="/admin">
                <Icon v="user-cog"/>
                <T>admin.header</T>
            </nuxt-link>
        </p>
        <h2>
            <Icon v="user-cog"/>
            Profiles
        </h2>

        <section>
            <ChartSet :name="`profiles (${config.locale})`" :data="chart" init="cumulative"/>
        </section>
    </div>
    </Page>
</template>

<script>
import {head} from "../src/helpers";

export default {
    async asyncData({ app }) {
        return {
            chart: await app.$axios.$get(`/admin/stats/users-chart/${process.env.LOCALE}`),
        };
    },
    head() {
        return head({
            title: this.$t('admin.header') + ' • Profiles',
        });
    },
}
</script>
