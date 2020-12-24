<template>
    <img :src="src || user.avatar || (user.avatarSource === 'gravatar' ? gravatar(user, size) : fallbackAvatar(user, size))" alt="" class="rounded-circle"
         :style="`width: 100%;max-width: ${dsize};max-height: ${dsize};`"/>
</template>

<script>
    import { fallbackAvatar, gravatar } from "../src/helpers";

    export default {
        props: {
            user: { required: true },
            src: {},
            size: { 'default': 128 },
            dsize: { 'default': '6rem' },
        },
        data() {
            return {
                fallbackAvatar,
                gravatar,
            };
        },
    }
</script>
