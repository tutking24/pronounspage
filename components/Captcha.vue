<template>
    <div style="height: 73px" @click="render"></div>
</template>

<script>
    import dark from "../plugins/dark";

    export default {
        mixins: [dark],
        props: {
            value: {},
        },
        async mounted() {
            if (!process.client) { return; }
            await this.$loadScript('hcaptcha', `https://js.hcaptcha.com/1/api.js?hl=${this.config.locale}`);
            setTimeout(() => { this.render() }, 500);
        },
        methods: {
            render() {
                if (!window.hcaptcha || this.$el.innerHTML.length) { return; }
                window.hcaptcha.render(this.$el, {
                    sitekey: process.env.HCAPTCHA_SITEKEY,
                    theme: this.detectDark() ? 'dark' : 'light',
                    callback: this.solved,
                });
            },
            solved(token) {
                this.$emit('input', token);
            },
        }
    }
</script>
