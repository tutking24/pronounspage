<template>
    <span :title="alt">
        <img :src="img" alt=""/>
        {{ name }}
    </span>
</template>

<script>
    export default {
        props: {
            name: { required: true },
            alt: { required: true },
            img: { required: true },
        },
    }
</script>

<style lang="scss" scoped>
    img {
        height: 1rem;
    }
</style>
