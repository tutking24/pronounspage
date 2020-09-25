<template>
    <span :class="['fa' + set, 'fa-' + v, 'fa-fw']" :style="`font-size: ${size}em`"></span>
</template>

<script>
    export default {
        props: {
            v: { required: true },
            set: { default: 'l' },
            size: { default: 1 },
        }
    }
</script>
