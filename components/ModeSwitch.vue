<template>
    <div class="py-2 px-3">
        <div class="form-check form-switch text-dark">
            <label>
                <input class="form-check-input" type="checkbox" v-model="isDark">
                <Icon :v="isDark ? 'moon' : 'sun'"/>
            </label>
        </div>
    </div>
</template>

<script>
    import dark from "../plugins/dark";

    export default {
        mixins: [dark],
        data() {
            return {
                isDark: false,
            }
        },
        mounted() {
            if (!process.client) {
                return false;
            }

            this.isDark = this.detectDark();
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => this.isDark = e.matches);
        },
        watch: {
            isDark(dark) {
                this.setMode(dark);
            }
        }
    }
</script>
