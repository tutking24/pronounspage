<template>
    <component :is="Array.isArray(txt) ? 'div' : 'span'" :class="[translationMode && $isGranted() ? 't-translation-mode' : '', modified ? 't-modified' : '']" @click="clicked"><template v-if="Array.isArray(txt)"><p v-for="p in txt"><Icon v-if="icon" :v="icon"/><LinkedText :text="p"/></p></template><template v-else><Icon v-if="icon" :v="icon"/><LinkedText :text="txt"/></template></component>
</template>

<script>
    import t from '../src/translator';
    import {mapState} from "vuex";

    export default {
        props: {
            params: {},
            silent: {type: Boolean},
            icon: {},
        },
        data() {
            return {
                key: this.$slots.default[0].text,
            }
        },
        computed: {
            ...mapState([
                'translationMode',
                'translationChanges',
            ]),
            modified() {
                return this.translationChanges.hasOwnProperty(this.key);
            },
            txt() {
                return this.modified
                    ? t(this.translationChanges[this.key], this.params || {}, !this.silent, false)
                    : t(this.key, this.params || {}, !this.silent);
            }
        },
        methods: {
            async clicked(e) {
                if (!this.translationMode) { return; }

                e.preventDefault();
                e.stopPropagation();

                const newValue = await this.$editor(
                    this.modified ? this.translationChanges[this.key] : t(this.key),
                    { icon: 'language', header: this.key },
                    'info'
                );

                if (newValue !== undefined) {
                    this.$store.commit('translate', {key: this.key, newValue});
                }
            },
        },
    }
</script>

<style lang="scss" scoped>
@import "assets/variables";

.t-translation-mode {
    border: 1px solid rgba($primary, 50%);
    cursor: alias;
    &:hover {
        border: 1px solid $primary;
    }
}

.t-modified {
    background-color: rgba($primary, 30%);
}
</style>
