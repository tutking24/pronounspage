<template>
    <ul class="list-inline">
        <li class="list-inline-item">
            <T>mode.accessibility</T>
        </li>
        <li class="list-inline-item">
            <label class="form-check form-switch d-inline-block">
                <input class="form-check-input" type="checkbox" role="switch" v-model="reducedColours">
                <T>mode.reducedColours</T>
            </label>
        </li>
        <li class="list-inline-item">
            <label class="form-check form-switch d-inline-block">
                <input class="form-check-input" type="checkbox" role="switch" v-model="reducedItems">
                <T>mode.reducedItems</T>
            </label>
        </li>
    </ul>
</template>

<script>
    export default {
        data() {
            return {
                reducedColours: false,
                reducedItems: false,
            }
        },
        mounted() {
            if (!process.client) { return; }

            this.reducedColours = localStorage.getItem('reducedColours') === 'true';
            this.reducedItems = localStorage.getItem('reducedItems') === 'true';
            this.$store.commit('setReducedItems', this.reducedItems);
        },
        watch: {
            reducedColours(v) {
                document.body.classList.toggle('reduced-colours', v);
                localStorage.setItem('reducedColours', v);
            },
            reducedItems(v) {
                localStorage.setItem('reducedItems', v);
                this.$store.commit('setReducedItems', this.reducedItems);
            },
        }
    }
</script>
