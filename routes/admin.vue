<template>
    <Page wide>
    <NotFound v-if="!$isGranted('panel')"/>
    <div v-else>
        <div class="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center">
            <div>
                <h2>
                    <Icon v="user-cog"/>
                    <T>admin.header</T>
                </h2>

                <p class="small"><em>
                    Stats calculated at:
                    <span :class="stats.calculatedAt < (new Date() - 24*60*60*1000) / 1000 ? `badge bg-danger text-white` : ''">
                        {{$datetime(stats.calculatedAt)}}
                    </span>
                </em></p>
            </div>
            <div class="form-check form-switch my-2">
                <label>
                    <input class="form-check-input" type="checkbox" v-model="filterAttention">
                    <Icon v="filter"/>
                    Only show items requiring attention
                </label>
            </div>
        </div>

        <h3>General</h3>

        <div class="row mb-4">
            <AdminDashboardCard
                v-if="$isGranted('users')"
                v-show="!filterAttention"
                icon="users"
                header="Users"
                link="/admin/users"
                :counts="[
                    {count: stats._.users},
                    {name: 'admins', count: stats._.admins},
                ]"
            />
            <AdminDashboardCard
                v-if="$isGranted('users')"
                v-show="!filterAttention || stats._.bansPending"
                icon="ban"
                header="Pending bans"
                link="/admin/pending-bans"
                :counts="[
                    {count: stats._.bansPending, warning: 1, danger: 16},
                ]"
            />
            <AdminDashboardCard
                v-if="$isGranted('users')"
                v-show="!filterAttention || stats._.userReports"
                icon="siren-on"
                header="Abuse reports"
                link="/admin/abuse-reports"
                :counts="[
                    {count: stats._.userReports, warning: 1, danger: 16},
                ]"
            />
            <AdminDashboardCard
                v-show="!filterAttention"
                icon="user-cog"
                link="/admin/moderation"
                header="Moderation rules"
            />
            <AdminDashboardCard
                v-if="$isGranted('code')"
                v-show="!filterAttention || stats._.cardsQueue"
                icon="id-card"
                header="Cards queue"
                :counts="[
                    {count: stats._.cardsQueue, warning: 16, danger: 64},
                ]"
            />
            <AdminDashboardCard
                v-if="$isGranted('code')"
                v-show="!filterAttention || stats._.linksQueue"
                icon="link"
                header="Links queue"
                :counts="[
                    {count: stats._.linksQueue, warning: 64, danger: 256},
                ]"
            />
            <AdminDashboardCard
                v-show="!filterAttention"
                icon="bell"
                header="Email notifications"
            >
                <span v-for="(label, value) in {0: 'Never', 1: 'Daily', 7: 'Weekly'}" class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="inlineRadioOptions" :id="`notifiactionFrequency_${value}`" :value="value" v-model="adminNotifications">
                    <label class="form-check-label" :for="`notifiactionFrequency_${value}`">{{label}}</label>
                </span>
            </AdminDashboardCard>
            <AdminDashboardCard
                v-show="!filterAttention"
                v-if="$isGranted('users')"
                icon="user-secret"
                header="@example"
            >
                <button class="btn btn-primary btn-sm" @click="impersonate('example@pronouns.page')">Impersonate</button>
            </AdminDashboardCard>
            <AdminDashboardCard
                v-show="!filterAttention"
                icon="b:discord"
                link="https://discord.gg/PNDumDjvnP"
                header="Team Discord"
            />
            <AdminDashboardCard
                v-show="!filterAttention"
                icon="palette"
                link="/admin/design"
                header="Design guidelines"
            />
            <AdminDashboardCard
                v-show="!filterAttention"
                icon="file-spreadsheet"
                link="/admin/timesheets"
                header="Volunteering timesheets"
            />
        </div>

        <template v-for="({name, config: localeConfig, url, published}, locale) in allLocales" v-if="$isGranted('panel', locale) && stats[locale]">
            <h3>
                {{ name }}
                <small v-if="!published" class="text-muted">(not published yet)</small>
            </h3>
            <div class="row mb-4">
                <AdminDashboardCard
                    v-show="!filterAttention"
                    :baseUrl="url"
                    icon="users"
                    header="Profiles"
                    link="/admin/profiles"
                    :counts="[
                        {count: stats[locale].users},
                    ]"
                />
                <AdminDashboardCard
                    v-if="localeConfig.nouns && localeConfig.nouns.enabled && $isGranted('nouns', locale) && (stats[locale].nouns.approved > 0 || stats[locale].nouns.awaiting > 0)"
                    v-show="!filterAttention || stats[locale].nouns.awaiting"
                    :baseUrl="url"
                    icon="book"
                    header="Dictionary"
                    :link="`/${localeConfig.nouns.route}`"
                    :counts="[
                        {count: stats[locale].nouns.approved},
                        {name: 'awaiting', count: stats[locale].nouns.awaiting, warning: 1, danger: 16},
                    ]"
                />
                <AdminDashboardCard
                    v-if="localeConfig.inclusive && localeConfig.inclusive.enabled && $isGranted('inclusive', locale) && (stats[locale].inclusive.approved > 0 || stats[locale].inclusive.awaiting > 0)"
                    v-show="!filterAttention || stats[locale].inclusive.awaiting"
                    :baseUrl="url"
                    icon="book-heart"
                    header="Inclusive"
                    :link="`/${localeConfig.inclusive.route}`"
                    :counts="[
                        {count: stats[locale].inclusive.approved},
                        {name: 'awaiting', count: stats[locale].inclusive.awaiting, warning: 1, danger: 16},
                    ]"
                />
                <AdminDashboardCard
                    v-if="localeConfig.terminology && localeConfig.terminology.enabled && $isGranted('terms', locale) && (stats[locale].terms.approved > 0 || stats[locale].terms.awaiting > 0)"
                    v-show="!filterAttention || stats[locale].terms.awaiting"
                    :baseUrl="url"
                    icon="flag"
                    header="Terminology"
                    :link="`/${localeConfig.terminology.route}`"
                    :counts="[
                        {count: stats[locale].terms.approved},
                        {name: 'awaiting', count: stats[locale].terms.awaiting, warning: 1, danger: 16},
                    ]"
                />
                <AdminDashboardCard
                    v-if="localeConfig.sources && localeConfig.sources.enabled && $isGranted('sources', locale) && (stats[locale].sources.approved > 0 || stats[locale].sources.awaiting > 0)"
                    v-show="!filterAttention || stats[locale].sources.awaiting"
                    :baseUrl="url"
                    icon="books"
                    header="Sources"
                    :link="`/${localeConfig.sources.route}`"
                    :counts="[
                        {count: stats[locale].sources.approved},
                        {name: 'awaiting', count: stats[locale].sources.awaiting, warning: 1, danger: 16},
                    ]"
                />
                <AdminDashboardCard
                    v-if="localeConfig.names && localeConfig.names.enabled && $isGranted('names', locale) && (stats[locale].names.approved > 0 || stats[locale].names.awaiting > 0)"
                    v-show="!filterAttention || stats[locale].names.awaiting"
                    :baseUrl="url"
                    icon="signature"
                    header="Names"
                    :link="`/${localeConfig.names.route}`"
                    :counts="[
                        {count: stats[locale].names.approved},
                        {name: 'awaiting', count: stats[locale].names.awaiting, warning: 1, danger: 16},
                    ]"
                />
                <AdminDashboardCard
                    v-if="$isGranted('translations', locale) && (stats[locale].translations.missing > 0 || stats[locale].translations.awaitingApproval > 0 || stats[locale].translations.awaitingMerge > 0)"
                    v-show="!filterAttention || stats[locale].translations.missing || stats[locale].translations.awaitingApproval || stats[locale].translations.awaitingMerge"
                    :baseUrl="url"
                    icon="language"
                    header="Translations"
                    :counts="[
                        {name: 'missing', link: '/admin/translations/missing', count: stats[locale].translations.missing, warning: 1, danger: 16},
                        {name: 'proposed', link: '/admin/translations/awaiting', count: stats[locale].translations.awaitingApproval, warning: 1, danger: 16},
                        {name: 'not merged', link: '/admin/translations/awaiting', count: stats[locale].translations.awaitingMerge, warning: 1, danger: 16, enabled: $isGranted('code')},
                    ]"
                />
            </div>
        </template>
    </div>
    </Page>
</template>

<script>
    import {head} from "../src/helpers";

    export default {
        data() {
            return {
                adminNotifications: this.$user() ? (this.$user().adminNotifications ?? 7) : 7,
                filterAttention: false,
            }
        },
        async asyncData({ app }) {
            return {
                stats: await app.$axios.$get(`/admin/stats`),
                allLocales: await app.$axios.$get(`/admin/all-locales`),
            };
        },
        methods: {
            async impersonate(email) {
                const { token } = await this.$axios.$get(`/admin/impersonate/${encodeURIComponent(email)}`);
                this.$cookies.set('impersonator', this.$cookies.get('token'));
                this.$cookies.set('token', token);
                await this.$router.push('/' + this.config.user.route);
                setTimeout(() => window.location.reload(), 500);
            },
        },
        watch: {
            async adminNotifications() {
                const res = await this.$axios.$post(`/admin/set-notification-frequency`, {frequency: parseInt(this.adminNotifications)});
                this.$store.commit('setToken', res.token);
            },
        },
        head() {
            return head({
                title: this.$t('admin.header'),
            });
        },
    }
</script>
