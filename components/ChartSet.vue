<template>
    <div class="card">
        <div class="card-header">
            <p v-if="header" class="h6 d-inline-block me-3"><strong>{{header}}</strong></p>
            <div class="form-check form-check-inline"
                 v-for="(desc, m) in {'': 'Hide chart', 'daily': 'Daily change chart', 'cumulative': 'Cumulative chart'}">
                <label class="form-check-label">
                    <input class="form-check-input" type="radio" v-model="mode" :value="m">
                    {{desc}}
                </label>
            </div>
        </div>
        <div class="card-body" v-if="mode">
            <Chart :data="data" :label="`new ${name} per day`" v-show="mode === 'daily'"/>
            <Chart :data="data" :label="`cumulative ${name}`" cumulative v-show="mode === 'cumulative'"/>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            name: { required: true },
            data: { required: true },
            init: { 'default': '' },
            header: {},
        },
        data() {
            return {
                mode: this.init,
            }
        },
    }
</script>
