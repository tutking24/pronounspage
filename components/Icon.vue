<template>
    <span :class="['fal', 'fa-' + v, 'fa-fw']"></span>
</template>

<script>
    export default {
        props: {
            v: { required: true },
        }
    }
</script>
