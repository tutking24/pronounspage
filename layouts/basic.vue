<template>
    <main class="container vh-100">
        <Nuxt/>
    </main>
</template>

<script>
    import dark from "../plugins/dark";

    export default {
        mixins: [dark],
        mounted() {
            this.setMode(this.detectDark());
        }
    }
</script>

<style lang="scss">
    @import "assets/style";
</style>
