export default {
    methods: {
        handleHash(namespace, callback, checkAnchor = true) {
            if (!process.client || !window.location.hash) {
                return;
            }

            const anchor = decodeURIComponent(window.location.hash.substr(1));
            setTimeout(_ => {
                const $anchor = document.getElementById(anchor);
                if (checkAnchor && $anchor) {
                    $anchor.scrollIntoView();
                } else if (!namespace) {
                    callback(anchor);
                } else if (anchor.startsWith(namespace + '/')) {
                    callback(anchor.substring(namespace.length + 1));
                }
            }, 500);
        },
        setHash(namespace, value) {
            if (!process.client) {
                return;
            }

            history.pushState(
                '',
                document.title,
                window.location.pathname + window.location.search
                    + (value ? '#' + (namespace ? namespace + '/' + value : value) : '')
            );
        },
    }
}
