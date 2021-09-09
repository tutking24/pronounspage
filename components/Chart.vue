<template>
    <canvas></canvas>
</template>

<script>
    import {sleep} from "../src/helpers";

    export default {
        props: {
            label: { required: true },
            data: { required: true },
            cumulative: { type: Boolean },
            type: {'default': 'line'},
        },
        async created() {
        },
        async mounted() {
            if (!process.client) { return; }

            await this.$loadScript('charts', 'https://cdn.jsdelivr.net/npm/chart.js@2.9.3/dist/Chart.bundle.min.js');
            this.drawChart();
        },
        methods: {
            async drawChart() {
                let tries = 0;
                while (window.Chart === undefined) {
                    await sleep(100);
                    if (tries++ > 1000) {
                        return;
                    }
                }
                new Chart(this.$el.getContext('2d'), {
                    type: this.type,
                    data: {
                        labels: Object.keys(this.data),
                        datasets: [{
                            label: this.label,
                            data: this.cumulative ? this.accumulate(Object.values(this.data)) : Object.values(this.data),
                            fill: false,
                            borderColor: '#C71585',
                        }],
                    },
                });
            },
            accumulate(values) {
                const newValues = [];
                let acc = 0;
                for (let v of values) {
                    acc += v;
                    newValues.push(acc);
                }
                return newValues;
            },
        },
    }
</script>
