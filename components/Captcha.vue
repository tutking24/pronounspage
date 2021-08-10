<template>
    <div style="height: 73px"></div>
</template>

<script>
    import dark from "../plugins/dark";

    export default {
        mixins: [dark],
        props: {
            value: {},
        },
        async mounted() {
            if (!process.client) {
                return false;
            }

            await this.$loadScript('hcaptcha', 'https://js.hcaptcha.com/1/api.js');

            window.hcaptcha.render(this.$el, {
                sitekey: process.env.HCAPTCHA_SITEKEY,
                theme: this.detectDark() ? 'dark' : 'light',
                callback: this.solved,
            });
        },
        methods: {
            solved(token) {
                alert(token);
                this.$emit('input', token);
            },
        }
    }
</script>
