<script>
    export default {
        props: {
            text: { required: true },
        },
        render(h) {
            let isLink = false;
            let buffer = '';
            let linkBuffer = '';
            const children = [];
            const buildLink = _ => {
                if (!isLink) {
                    return buffer.indexOf('<') !== -1
                        ? h('span', {domProps: { innerHTML: buffer }})
                        : buffer;
                }

                if (linkBuffer.indexOf('https://') === 0) {
                    return h(
                        'a',
                        {domProps: {href: linkBuffer, target: '_blank', rel: 'noopener'}},
                        buffer,
                    )
                }

                return h('nuxt-link', {props: { to: linkBuffer || '/neutratywy#' + buffer }}, buffer)
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
                    linkBuffer = buffer;
                    buffer = '';
                    continue;
                }
                buffer += c;
            }
            addChild();

            return h('span', children);
        },
    }
</script>
