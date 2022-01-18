<template>
    <div class="btn-group" role="group">
        <button v-for="(buttonIcon, buttonMode) in modes" type="button"
                :class="['btn', 'btn-sm', mode === buttonMode ? 'btn-primary' : 'btn-outline-primary']"
                @click="mode = buttonMode"
        >
            <Icon :v="buttonIcon"/>
            <T>mode.{{ buttonMode }}</T>
        </button>
    </div>
</template>

<script>
    import dark from "../plugins/dark";

    export default {
        mixins: [dark],
        data() {
            return {
                mode: 'automatic',
                isDark: false,
                modes: {
                    light: 'sun',
                    automatic: 'eclipse',
                    dark: 'moon',
                }
            }
        },
        mounted() {
            if (!process.client) {
                return false;
            }

            this.mode = this.getMode();
            this.isDark = this.detectDark();

            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => this.isDark = this.detectDark());

            this.$eventHub.$on('mode-changed', mode => {
                if (mode !== this.mode) {
                    this.mode = mode;
                }
            })
        },
        watch: {
            mode() {
                this.$eventHub.$emit('mode-changed', this.mode);
                this.setMode(this.mode);
                this.isDark = this.detectDark();
            },
            isDark() {
                this.setIsDark(this.isDark);
                this.$store.commit('setDarkMode', this.isDark);
            }
        }
    }
</script>
