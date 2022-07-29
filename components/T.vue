<template>
    <component :is="Array.isArray(txt) ? 'div' : 'span'" :class="[translationMode && $isGranted() ? 't-translation-mode' : '', modified ? 't-modified' : '']" @click="clicked"><template v-if="Array.isArray(txt)"><p v-for="p in txt"><Icon v-if="icon" :v="icon"/><LinkedText :text="p"/></p></template><template v-else><Icon v-if="icon" :v="icon"/><LinkedText :text="txt"/></template></component>
</template>

<script>
    import translator from '../src/translator';
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
                return this.translationMode && this.translationChanges.hasOwnProperty(this.key);
            },
            txt() {
                return this.modified
                    ? translator.applyParams(this.translationChanges[this.key], this.params || {})
                    : translator.translate(this.key, this.params || {}, !this.silent);
            }
        },
        methods: {
            async clicked(e) {
                if (!this.translationMode) { return; }

                e.preventDefault();
                e.stopPropagation();

                const base = translator.get(this.key, false, true);

                const newValue = await this.$editor(
                    this.modified
                        ? this.translationChanges[this.key]
                        : translator.get(this.key),
                    {
                        icon: 'language',
                        header: this.key,
                        message: base
                            ? ('<div class="small alert alert-info">'
                                + (Array.isArray(base)
                                    ? `<ul>${base.map(el => '<li>' + el + '</el>')}</ul>`
                                    : base)
                                + '</div>')
                            : undefined,
                        margin: false,
                    },
                    'info'
                );

                if (newValue !== undefined) {
                    this.$store.commit('translate', {key: this.key, newValue});
                    this.$cookies.set('translations', this.$store.state.translationChanges);
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
