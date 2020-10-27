<template>
    <img :src="gravatar" alt="" class="rounded-circle"/>
</template>

<script>
    import { gravatar } from "../src/helpers";

    export default {
        props: {
            user: { required: true },
            size: { 'default': 128 }
        },
        data() {
            return {
                gravatar: gravatar(this.user, this.size),
            };
        },
    }
</script>

<style lang="scss" scoped>
    $size: 6rem;
    img {
        width: 100%;
        max-width: $size;
        max-height: $size;
    }
</style>
