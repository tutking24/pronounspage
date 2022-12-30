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
            <Icon v="siren-on"/>
            Abuse reports
            ({{abuseReportsActiveCount}})
        </h2>

        <section>
            <ModerationRules type="rulesUsers" emphasise/>
            <ModerationRules type="susRegexes" label="Keywords for automated triggers"/>
            <Loading :value="abuseReports">
                <AbuseReports :abuseReports="abuseReports" allowResolving/>
            </Loading>
        </section>
    </div>
    </Page>
</template>

<script>
import {head} from "../src/helpers";

export default {
    async asyncData({ app }) {
        return {
            abuseReports: await app.$axios.$get(`/admin/reports`),
        };
    },
    computed: {
        abuseReportsActiveCount() {
            return this.abuseReports ? this.abuseReports.filter(r => !r.isHandled).length : '–';
        },
    },
    head() {
        return head({
            title: this.$t('admin.header') + ' • Abuse reports',
        });
    },
}
</script>
