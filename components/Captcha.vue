<template>
    <div class="h-captcha"
         :data-theme="isDark ? 'dark' : 'light'"
         :data-sitekey="siteKey"
         data-callback="hCaptchaDone"
    ></div>
</template>

<script>
    import dark from "../plugins/dark";

    export default {
        mixins: [dark],
        props: {
            value: {},
        },
        data() {
            return {
                siteKey: process.env.HCAPTCHA_SITEKEY,
                isDark: false,
            };
        },
        mounted() {
            if (!process.client) {
                return false;
            }

            this.isDark = this.detectDark();
            this.$loadScript('hcaptcha', 'https://js.hcaptcha.com/1/api.js');
            window.hCaptchaDone = (token) => {
                this.$emit('input', token);
            }
        },
    }
</script>
