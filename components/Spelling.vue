<script>
    import spelling from "../plugins/spelling";

    export default {
        mixins: [ spelling ],
        props: {
            text: {},
        },
        render(h) {
            return h('span', {domProps: { innerHTML: this.handleSpelling(this.val) }});
        },
        computed: {
            val() {
                if (this.text !== undefined) {
                    return this.text;
                }
                if (this.$slots.default && this.$slots.default.length) {
                    return this.$slots.default[0].text;
                }
                return ''
            }
        }
    }
</script>
