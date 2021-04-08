<template>
    <canvas></canvas>
</template>

<script>
    export default {
        props: {
            name: { required: true },
            data: { required: true },
            cumulative: { type: Boolean },
        },
        created() {
            this.$loadScript('charts', 'https://cdn.jsdelivr.net/npm/chart.js@2.9.3/dist/Chart.bundle.min.js');
        },
        mounted() {
            if (process.client) {
                setTimeout(_ => {
                    this.drawChart();
                }, 1000);
            }
        },
        methods: {
            drawChart() {
                new Chart(this.$el.getContext('2d'), {
                    type: 'line',
                    data: {
                        labels: Object.keys(this.data),
                        datasets: [{
                            label: this.cumulative ? `cumulative ${this.name}` : `new ${this.name} per day`,
                            data: this.cumulative ? this.accumulate(Object.values(this.data)) : Object.values(this.data),
                            fill: false,
                            borderColor: '#C71585',
                        }],
                    }
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
