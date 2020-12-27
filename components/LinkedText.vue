<script>
    import Icon from './Icon';
    import {mapState} from "vuex";
    import zhConverter from 'zh_cn_zh_tw';

    export default {
        props: {
            text: { required: true },
        },
        render(h) {
            if (!this.text) {
                return h('span');
            }

            let isLink = false;
            let isIcon = false;
            let buffer = '';
            let linkBuffer = '';
            const children = [];
            const buildLink = _ => {
                if (isIcon) {
                    return h(Icon, {props: { v: buffer}});
                }

                const bufferNode = [ h('span', {domProps: { innerHTML: this.handleSpelling(buffer) }}) ];

                if (!isLink) {
                    return bufferNode;
                }

                if (linkBuffer.indexOf('https://') === 0
                    || linkBuffer.indexOf('http://') === 0
                    || linkBuffer.indexOf('mailto:') === 0
                ) {
                    return h(
                        'a',
                        {domProps: {href: linkBuffer, target: '_blank', rel: 'noopener'}},
                        bufferNode,
                    );
                }

                if (linkBuffer.indexOf('#') === 0) {
                    return h(
                        'a',
                        {domProps: {href: linkBuffer}},
                        bufferNode,
                    );
                }

                return h('nuxt-link', {props: { to: linkBuffer || '/' + this.config.nouns.route + '#' + this.handleSpelling(buffer) }}, bufferNode);
            }
            const addChild = _ => {
                if (!buffer) {
                    return;
                }
                children.push(buildLink());
                buffer = '';
                linkBuffer = '';
            }
            for (let c of this.text) {
                if (c === '{') {
                    addChild();
                    isLink = true;
                    continue;
                } else if (c === '}') {
                    addChild();
                    isLink = false;
                    continue;
                } else if (isLink && c === '=') {
                    if (linkBuffer) {
                        linkBuffer += '='
                    }
                    linkBuffer += buffer;
                    buffer = '';
                    continue;
                } else if (c === '[') {
                    addChild();
                    isIcon = true;
                    continue;
                } else if (c === ']') {
                    addChild();
                    isIcon = false;
                    continue;
                }
                buffer += c;
            }
            addChild();

            return h('span', children);
        },
        computed: {
            ...mapState([
                'spelling',
            ]),
        },
        methods: {
            handleSpelling(str) {
                if (this.config.locale !== 'zh' || this.spelling === 'traditional') {
                    return str;
                }

                return zhConverter.convertToSimplifiedChinese(str);
            }
        },
    }
</script>
