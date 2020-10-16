<template>
    <span>
        <img :src="src" alt=""/>
        {{ name }}
    </span>
</template>

<script>
    export default {
        props: {
            name: { required: true },
            src: { required: true },
        }
    }
</script>

<style lang="scss" scoped>
    img {
        height: 1rem;
    }
</style>
