<template>
    <a :href="buildImageUrl(id, 'big')" target="_blank" rel="noopener" class="d-inline-block"
       @click.prevent="$eventHub.$emit('lightbox', buildImageUrl(id, 'big'))"
    >
        <img :src="buildImageUrl(id, 'thumb')" class="border rounded-lg"/>
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
