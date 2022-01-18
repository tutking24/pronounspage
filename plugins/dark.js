export default {
    methods: {
        getMode() {
            if (!process.client) { return 'automatic'; }

            return localStorage.getItem('mode') || 'automatic';
        },
        detectDark() {
            if (!process.client) { return false; }

            switch (this.getMode()) {
                case 'light':
                    return false;
                case 'dark':
                    return true;
                case 'automatic':
                default:
                    return window.matchMedia('(prefers-color-scheme: dark)').matches;
            }
        },
        setMode(mode) {
            if (!process.client) { return; }

            localStorage.setItem('mode', mode);
        },
        setIsDark(dark) {
            if (!process.client) { return; }

            if (dark) {
                document.body.setAttribute('data-theme', 'dark');
            } else {
                document.body.removeAttribute('data-theme');
            }
        },
    }
}
