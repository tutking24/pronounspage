<script>
    import Icon from './Icon';

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

                if (!isLink) {
                    return buffer.indexOf('<') !== -1
                        ? h('span', {domProps: { innerHTML: buffer }})
                        : buffer;
                }

                if (linkBuffer.indexOf('https://') === 0 || linkBuffer.indexOf('http://') === 0 || linkBuffer.indexOf('mailto:') === 0) {
                    return h(
                        'a',
                        {domProps: {href: linkBuffer, target: '_blank', rel: 'noopener'}},
                        buffer,
                    );
                }

                return h('nuxt-link', {props: { to: linkBuffer || '/' + this.config.nouns.route + '#' + buffer }}, buffer);
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
    }
</script>
