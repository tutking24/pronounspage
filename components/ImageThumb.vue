<template>
    <a :href="buildImageUrl(id, bigSize)" target="_blank" rel="noopener" class="d-inline-block"
       @click.prevent="$eventHub.$emit('lightbox', buildImageUrl(id, bigSize))"
    >
        <img :src="buildImageUrl(id, smallSize)" class="border rounded-lg" :style="`height: ${size}; width: auto;`"/>
    </a>
</template>

<script>
    export default {
        props: {
            id: {required: true},
            smallSize: {'default': 'thumb'},
            bigSize: {'default': 'big'},
            size: {'default': 'auto'}
        },
    }
</script>

<style lang="scss" scoped>
    img {
        height: 8rem;
        width: 8rem;
    }
</style>
