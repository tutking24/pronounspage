<template>
    <div v-if="publishDates !== null && $isGranted('sources')" class="card">
        <a class="card-header cursor-pointer" href="#" @click.prevent="open = !open">
            <Icon v="chart-line"/>
            Chart
        </a>
        <div class="card-body" v-if="open">
            <p class="small">
                <Icon v="chart-line"/>
                This chart is only visible for the admins.
                Please take it with a grain of salt, considering that our list of sources is very incomplete.
            </p>
            <Chart :data="publishDates" :label="label"/>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            sources: { required: true },
            label: { required: true },
        },
        data() {
            return {
                open: false,
            }
        },
        computed: {
            publishDates() {
                if (this.sources === undefined) {
                    return null;
                }
                const dates = {};
                let count = 0;
                let min, max;
                for (let source of this.sources) {
                    if (source.year) {
                        if (dates[source.year] === undefined) { dates[source.year] = 0; }
                        dates[source.year]++;
                        count++;
                        if (min === undefined || source.year < min) {
                            min = source.year;
                        }
                        if (max === undefined || source.year > max) {
                            max = source.year;
                        }
                    }
                }
                if (Object.keys(dates).length < 2 || count < 5) {
                    return null;
                }
                for (let i = min + 1; i < max; i++) {
                    if (dates[i] === undefined) {
                        dates[i] = 0;
                    }
                }
                return dates;
            },
        },
    }
</script>
