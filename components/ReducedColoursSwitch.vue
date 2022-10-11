<template>
    <label class="form-check form-switch d-inline-block">
        <input class="form-check-input" type="checkbox" role="switch" v-model="reducedColours">
        <T>mode.reducedColours</T>
    </label>
</template>

<script>
    export default {
        data() {
            return {
                reducedColours: false,
            }
        },
        mounted() {
            if (!process.client) { return; }

            this.reducedColours = !!(localStorage.getItem('reducedColours') || false);
        },
        watch: {
            reducedColours(v) {
                document.body.classList.toggle('reduced-colours', v);
                localStorage.setItem('reducedColours', v);
            },
        }
    }
</script>
