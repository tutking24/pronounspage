<script>
    import spelling from "../plugins/spelling";

    export default {
        mixins: [ spelling ],
        props: {
            text: {},
        },
        render(h) {
            return h('span', {domProps: { innerHTML: this.handleSpelling(this.text !== undefined ? this.text : this.$slots.default[0].text) }});
        },
    }
</script>
