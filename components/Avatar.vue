<template>
    <img :src="src || gravatar" alt="" class="rounded-circle" :style="`width: 100%;max-width: ${dsize};max-height: ${dsize};`"/>
</template>

<script>
    import { gravatar } from "../src/helpers";

    export default {
        props: {
            user: { required: true },
            size: { 'default': 128 },
            dsize: { 'default': '6rem' },
            src: {},
        },
        data() {
            return {
                gravatar: gravatar(this.user, this.size),
            };
        },
    }
</script>
