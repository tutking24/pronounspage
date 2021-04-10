<template>
    <div class="card">
        <div class="card-header">
            <div class="form-check form-check-inline"
                 v-for="(desc, m) in {'': 'Hide chart', 'daily': 'Daily new chart', 'cumulative': 'Cumulative chart'}">
                <label class="form-check-label">
                    <input class="form-check-input" type="radio" v-model="mode" :value="m">
                    {{desc}}
                </label>
            </div>
        </div>
        <div class="card-body" v-if="mode">
            <Chart :name="name" :data="data" v-show="mode === 'daily'"/>
            <Chart :name="name" :data="data" cumulative v-show="mode === 'cumulative'"/>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            name: { required: true },
            data: { required: true },
            init: { 'default': '' },
        },
        data() {
            return {
                mode: this.init,
            }
        },
    }
</script>
