<template>
    <span :class="['fa' + set, 'fa-' + v, 'fa-fw']"></span>
</template>

<script>
    export default {
        props: {
            v: { required: true },
            set: { default: 'l' },
        }
    }
</script>
