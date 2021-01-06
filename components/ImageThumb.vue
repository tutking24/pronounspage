<template>
    <a :href="getUrl('big')" target="_blank" rel="noopener"
       @click.prevent="$eventHub.$emit('lightbox', getUrl('big'))"
    >
        <img :src="getUrl('thumb')" class="border rounded-lg"/>
    </a>
</template>

<script>
    export default {
        props: {
            id: {required: true},
        },
        methods: {
            getUrl(size) {
                return `${process.env.BUCKET}/images/${this.id}-${size}.png`;
            },
        },
    }
</script>

<style lang="scss" scoped>
    img {
        height: 8rem;
        width: 8rem;
    }
</style>
