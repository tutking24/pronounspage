<template>
    <span class="tooltip-wrapper" :title="text" :aria-label="text" role="img"><slot></slot><span class="tooltip-content bg-dark text-white border px-2 py-1 rounded">{{ text }}</span></span>
</template>

<script>
    export default {
        props: {
            text: { required: true },
        },
    }
</script>

<style lang="scss">
    .tooltip-wrapper {
        position: relative;
        .tooltip-content {
            display: none;
            position: absolute;
            top: -2.2rem;
            left: -50%;
            font-weight: normal;
            font-style: normal;
            font-size: .85rem;
            white-space: nowrap;
        }
        &:hover {
            .tooltip-content {
                display: block;
            }
        }
    }
</style>
