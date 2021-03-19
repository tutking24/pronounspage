<script>
    import spelling from "../plugins/spelling";

    export default {
        mixins: [ spelling ],
        props: {
            text: { required: true },
        },
        render(h) {
            return h('span', {domProps: { innerHTML: this.handleSpelling(this.text) }});
        },
    }
</script>
