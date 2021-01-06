<template>
    <div class="d-flex flex-column vh-100">
        <div class="flex-grow-1">
            <Header/>
            <Nuxt/>
            <ScrollButton/>
        </div>
        <div>
            <Footer/>
        </div>
        <Confirm ref="confirm"/>
        <Lightbox/>
    </div>
</template>

<script>
    import Vue from 'vue';

    export default {
        mounted() {
            Vue.prototype.$confirm = (message, color='primary') => {
                return new Promise((resolve, reject) => {
                    this.$refs.confirm.show(message, color, resolve, reject);
                });
            };
        }
    }
</script>

<style lang="scss">
    @import "assets/style";
</style>
