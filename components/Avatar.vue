<template>
    <img :src="grav ? gravatar : (src || user.avatar || gravatar)" alt="" class="rounded-circle"
         :style="`width: 100%;max-width: ${dsize};max-height: ${dsize};`"/>
</template>

<script>
    import { gravatar } from "../src/helpers";

    export default {
        props: {
            user: { required: true },
            src: {},
            size: { 'default': 128 },
            dsize: { 'default': '6rem' },
            grav: { type: Boolean },
        },
        data() {
            return {
                gravatar: gravatar(this.user, this.size),
            };
        },
    }
</script>
