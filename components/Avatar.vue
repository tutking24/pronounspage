<template>
    <span>
        <img :src="src || user.avatar || (user.avatarSource === 'gravatar' ? gravatar(user, size) : fallbackAvatar(user, size))"
             alt="" class="rounded-circle"
             @error="failedToLoad = true"
             :style="`width: ${dsize};height: ${dsize};`"/>
        <small v-if="validate && failedToLoad" class="failed-to-load small text-danger"><T>user.avatar.failed</T></small>
    </span>
</template>

<script>
    import { fallbackAvatar, gravatar } from "../src/helpers";

    export default {
        props: {
            user: { required: true },
            src: {},
            size: { 'default': 128 },
            dsize: { 'default': '6rem' },
            validate: { type: Boolean }
        },
        data() {
            return {
                fallbackAvatar,
                gravatar,
                failedToLoad: false,
            };
        },
    }
</script>

<style lang="scss" scoped>
.failed-to-load {
    max-width: 200px;
    display: inline-block;
}
</style>
