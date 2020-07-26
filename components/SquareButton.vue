<template>
    <a :href="link" target="_blank" rel="noopener" class="btn-square m-1" :style="colour ? ('background-color: ' + colour) : 'colour'">
        <slot></slot>
    </a>
</template>

<script>
    export default {
        props: {
            link: { required: true },
            colour: { },
        },
    }
</script>

<style lang="scss" scoped>
    @import "assets/style";
    $size: 2.2rem;

    .btn-square {
        display: inline-grid;
        place-items: center;

        height: $size;
        min-width: $size;

        background-color: $primary;
        border-radius: $border-radius;
        border: none;
        color: white;
        line-height: 1.5;
        font-size: $size * 0.6;
        transition: opacity 300ms ease;

        &:hover {
            border: none;
            cursor: pointer;
            opacity: .7;
            color: white;
            text-decoration: none;
        }
    }
</style>
