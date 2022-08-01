<template>
    <div v-if="stats">
        <p class="h6 mb-2">
            <T>footer.stats.header</T><T>quotation.colon</T>
        </p>
        <p v-if="overall" class="small mb-2" :key="overall">
            <strong><T>footer.stats.overall</T></strong>
            |
            <a href="#" @click.prevent="overall = false"><T>footer.stats.current</T></a>
        </p>
        <p v-else class="small mb-2" :key="overall">
            <a href="#" @click.prevent="overall = true"><T>footer.stats.overall</T></a>
            |
            <strong><T>footer.stats.current</T></strong>
        </p>
        <ul :key="overall" class="list-unstyled">
            <li v-if="activeStats.cards" class="mb-2">
                <Icon v="id-card"/>
                <T>footer.stats.keys.cards</T><T>quotation.colon</T>
                <strong>{{ formatNumber(activeStats.cards) }}</strong>
            </li>
            <li v-if="activeStats.visitors" class="mb-2">
                <Icon v="fingerprint"/>
                <T>footer.stats.keys.visitors</T><T>quotation.colon</T>
                <strong>{{ formatNumber(activeStats.visitors) }}</strong> / month
            </li>
            <li v-if="activeStats.pageViews" class="mb-2">
                <Icon v="mouse"/>
                <T>footer.stats.keys.pageviews</T><T>quotation.colon</T>
                <strong>{{ formatNumber(activeStats.pageViews) }}</strong> / month
            </li>
            <li v-if="activeStats.online" class="mb-2">
                <Icon v="user-clock"/>
                <T>footer.stats.keys.realTimeVisitors</T><T>quotation.colon</T>
                <strong>{{ formatNumber(activeStats.online) }}</strong>
            </li>
            <li v-if="activeStats.users" class="mb-2">
                <Icon v="user-friends"/>
                <T>footer.stats.keys.users</T><T>quotation.colon</T>
                <strong>{{ formatNumber(activeStats.users) }}</strong>
            </li>
            <li v-if="activeStats.visitDuration" class="mb-2">
                <Icon v="stopwatch"/>
                <T>footer.stats.keys.visitDuration</T><T>quotation.colon</T>
                <strong>{{ formatDuration(activeStats.visitDuration) }}</strong>
            </li>
            <li class="mb-2 small">
                <a :href="`${plausibleHost}/${$t('domain')}?period=30d`" target="_blank" rel="noopener">
                    <Icon v="external-link"/>
                    Plausible
                </a>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    data() {
        return {
            stats: undefined,
            plausibleHost: process.env.PLAUSIBLE_API_HOST,
            overall: true,
        };
    },
    async mounted() {
        this.stats = await this.$axios.$get('/admin/stats-public')
    },
    methods: {
        formatNumber(number) {
            if (number > 1000000) {
                return (Math.round(10 * number / 1000000) / 10) + 'M';
            }
            if (number > 1000) {
                return (Math.round(10 * number / 1000) / 10) + 'k';
            }
            return number;
        },
        formatDuration(secondsCount) {
            const minutes = Math.floor(secondsCount / 60);
            const seconds = secondsCount % 60;
            let res = [];
            if (minutes > 0) {
                res.push(minutes + 'm')
            }
            if (seconds > 0) {
                res.push(seconds + 's')
            }
            return res.join(' ');
        },
    },
    computed: {
        activeStats() {
            if (this.stats === undefined) { return undefined; }

            return this.overall
                ? this.stats.overall
                : (this.stats.current || {});
        }
    },
}
</script>
