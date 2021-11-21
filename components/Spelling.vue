<script>
    import spelling from "../plugins/spelling";
    import { escapeHtml } from '../src/helpers';

    export default {
        mixins: [ spelling ],
        props: {
            text: { required: true },
            escape: { type: Boolean }
        },
        render(h) {
            let text = this.text || '';
            text = text.replace('<script', '');
            if (this.escape) {
                text = escapeHtml(text);
            }

            return h('span', {domProps: { innerHTML: this.handleSpelling(text) }});
        },
    }
</script>
