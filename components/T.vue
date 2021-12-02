<template>
    <component :is="Array.isArray(txt) ? 'div' : 'span'"><template v-if="Array.isArray(txt)"><p v-for="p in txt"><Icon v-if="icon" :v="icon"/><LinkedText :text="p"/></p></template><template v-else><Icon v-if="icon" :v="icon"/><LinkedText :text="txt"/></template></component>
</template>

<script>
    import t from '../src/translator';

    export default {
        props: {
            params: {},
            silent: {type: Boolean},
            icon: {},
        },
        data() {
            return {
                txt: t(this.$slots.default[0].text, this.params || {}, !this.silent),
            }
        },
    }
</script>
