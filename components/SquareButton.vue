<template>
    <a :href="link" target="_blank" rel="noopener" :class="['btn-square', 'm-1', 'bg-' + colour, 'text-' + textColour]" :style="colour.startsWith('#') ? ('background-color: ' + colour) : ''">
        <slot></slot>
    </a>
</template>

<script>
    export default {
        props: {
            link: { required: true },
            colour: { 'default': 'primary' },
            textColour: { 'default': 'white' },
        },
    }
</script>

<style lang="scss" scoped>
    @import "assets/variables";

    .btn-square {
        display: inline-block;
        height: $square-button-size;
        min-width: $square-button-size;
        text-align: center;

        border-radius: $border-radius;
        border: none;
        line-height: 1.5;
        font-size: $square-button-size * 0.6;
        transition: opacity 300ms ease;

        &:hover {
            border: none;
            cursor: pointer;
            opacity: .7;
            text-decoration: none;
        }

        img {
            width: 1em;
        }

        .fa-fw {
            position: relative;
            top: .2em;
        }
    }
</style>
