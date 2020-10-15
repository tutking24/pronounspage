<template>
    <img :src="gravatar(user.email)" alt="" class="rounded-circle"/>
</template>

<script>
    import md5 from 'js-md5';
    import { Base64 } from 'js-base64';

    export default {
        props: {
            user: { required: true },
        },
        methods: {
            gravatar(email, size = 128) {
                const fallback = `https://avi.avris.it/${size}/${Base64.encode(email).replace(/\+/g, '-').replace(/\//g, '_')}.png`;

                return `https://www.gravatar.com/avatar/${md5(email)}?d=${encodeURIComponent(fallback)}&s=${size}`;
            }
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
