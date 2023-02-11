<template>
    <canvas></canvas>
</template>

<script>
    import {sleep} from "../src/helpers";

    const COLOURS = [
        '#C71585',
        '#dc3545',
        '#fd7e14',
        '#ffc107',
        '#198754',
        '#20c997',
        '#0dcaf0',
        '#0d6efd',
        '#6610f2',
        '#6f42c1',
        '#d63384',
    ];

    export default {
        props: {
            label: { required: true },
            data: { required: true },
            cumulative: { type: Boolean },
            type: {'default': 'line'},
            options: {'default': () => { return {
                responsive: true,
                interaction: {
                    intersect: false,
                    mode: 'index',
                },
            }; }},
        },
        async created() {
        },
        async mounted() {
            if (!process.client) { return; }

            await this.$loadScript('charts', 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.7.0/chart.min.js');
            this.drawChart();
        },
        methods: {
            buildDataset(data, label, colour) {
                return {
                    label: label,
                    data: this.cumulative
                        ? this.accumulate(Object.values(data))
                        : Object.values(data),
                    fill: false,
                    borderColor: colour,
                }
            },
            isMultiDataset(data) {
                return Object.values(data).length > 0 && typeof(Object.values(data)[0]) === 'object';
            },
            async drawChart() {
                let tries = 0;
                while (window.Chart === undefined) {
                    await sleep(100);
                    if (tries++ > 1000) {
                        return;
                    }
                }

                let colourIndex = 0;
                new Chart(this.$el.getContext('2d'), {
                    type: this.type,
                    data: {
                        labels: this.isMultiDataset(this.data)
                            ? Array.from(Object.values(this.data).reduce((carry, item) => {
                                for (let key in item) {
                                    carry.add(key);
                                }
                                return carry;
                            }, new Set()))
                            : Object.keys(this.data),
                        datasets: this.isMultiDataset(this.data)
                            ? Object.entries(this.data).map(([key, data]) => this.buildDataset(data, key, COLOURS[colourIndex++ % COLOURS.length]))
                            : [ this.buildDataset(this.data, this.label, COLOURS[0]) ],
                    },
                    options: this.options,
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
