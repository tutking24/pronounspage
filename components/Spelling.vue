<script>
    import spelling from "../plugins/spelling";

    const escapeChars = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;'
    };

    export default {
        mixins: [ spelling ],
        props: {
            text: { required: true },
            escape: { type: Boolean }
        },
        render(h) {
            let text = this.text;
            text = text.replace('<script', '');
            if (this.escape) {
                text = text.replace(/[&<>"]/g, tag => escapeChars[tag] || tag);
            }

            return h('span', {domProps: { innerHTML: this.handleSpelling(text) }});
        },
    }
</script>
