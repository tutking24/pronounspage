<template>
    <div class="d-flex flex-column vh-100">
        <div class="flex-grow-1">
            <Header/>
            <main class="container">
                <Nuxt/>
                <ScrollButton/>
            </main>
        </div>
        <div class="container">
            <Footer/>
        </div>
        <DialogueBox ref="dialogue"/>
        <Lightbox/>
    </div>
</template>

<script>
    import Vue from 'vue';

    export default {
        mounted() {
            Vue.prototype.$alert = (message, color='primary') => {
                return new Promise((resolve, reject) => {
                    this.$refs.dialogue.show(false, message, color, resolve, reject);
                });
            };
            Vue.prototype.$confirm = (message, color='primary') => {
                return new Promise((resolve, reject) => {
                    this.$refs.dialogue.show(true, message, color, resolve, reject);
                });
            };
        }
    }
</script>

<style lang="scss">
    @import "assets/style";
</style>
