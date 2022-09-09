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
            const darkMode = this.detectDark();
            this.setIsDark(darkMode);
            this.$store.commit('setDarkMode', darkMode);
        }
    }
</script>

<style lang="scss">
    @import "assets/style";
</style>
