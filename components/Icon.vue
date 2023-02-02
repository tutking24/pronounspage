<template>
    <img v-if="iconSource" :src="iconSource" :style="`height: ${size}em; width: ${size}em; display: inline;`" alt="" class="icon" @error="fallBack"/>
    <span v-else :class="['fa' + iconSet, 'fa-' + icon, 'fa-fw']" :style="`font-size: ${size}em`"></span>
</template>

<script>
    export default {
        props: {
            v: { required: true },
            set: { default: 'l' },
            size: { default: 1 },
            inverse: { type: Boolean }
        },
        data() {
            return this.buildQueue(this.v);
        },
        watch: {
            v(v) {
                const {value, fallback} = this.buildQueue(v);

                this.value = value;
                this.fallback = fallback;
            },
        },
        computed: {
            valueParts() {
                return this.value.split(':');
            },
            icon() {
                return this.valueParts[this.valueParts.length - 1];
            },
            iconSet() {
                return this.valueParts.length > 1 ? this.valueParts[0] : this.set;
            },
            iconSource() {
                if (this.value.startsWith('https://')) {
                    return this.value;
                }
                if (this.value.endsWith('.svg')) {
                    return `/img/${this.inverse ? this.value.replace('.svg', '-inverse.svg') : this.value}`;
                }
                if (this.value.endsWith('.png')) {
                    return `/img/${this.inverse ? this.value.replace('.png', '-inverse.png') : this.value}`;
                }
                return null;
            },
        },
        methods: {
            buildQueue(v) {
                let values = Array.isArray(v) ? v : [v];
                values = values.filter(x => !!x);

                if (!values.length) {
                    values = ['spacer'];
                }

                return {
                    value: values.shift(),
                    fallbacks: values,
                };
            },
            fallBack() {
                if (!this.fallbacks.length) { return; }

                this.value = this.fallbacks.shift();
            },
        }
    }
</script>
