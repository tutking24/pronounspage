<template>
    <img v-if="v.endsWith('.svg')" :src="`/img/${v}`" :style="`height: ${size}em; width: 1.25em; display: inline;`" alt=""/>
    <span v-else :class="['fa' + set, 'fa-' + v, 'fa-fw']" :style="`font-size: ${size}em`"></span>
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
