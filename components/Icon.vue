<template>
    <img v-if="iconSource" :src="iconSource" :style="`height: ${size}em; width: ${size}em; display: inline;`" alt="" class="icon"/>
    <span v-else :class="['fa' + iconSet, 'fa-' + icon, 'fa-fw']" :style="`font-size: ${size}em`"></span>
</template>

<script>
    export default {
        props: {
            v: { required: true },
            set: { default: 'l' },
            size: { default: 1 },
        },
        computed: {
            valueParts() {
                return this.v.split(':');
            },
            icon() {
                return this.valueParts[this.valueParts.length - 1];
            },
            iconSet() {
                return this.valueParts.length > 1 ? this.valueParts[0] : this.set;
            },
            iconSource() {
                if (this.v.endsWith('.svg')) {
                    return `/img/${this.v}`;
                }
                if (this.v.startsWith('https://')) {
                    return this.v;
                }
                return null;
            },
        },
    }
</script>
