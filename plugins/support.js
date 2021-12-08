export default {
    methods: {
        supportLinks() {
            return [
                {headline: 'Ko-Fi', url: 'https://ko-fi.com/radajezykaneutralnego', icon: 'coffee',},
                {headline: 'PayPal', url: 'https://paypal.me/RJNeutralnego', icon: 'paypal', iconSet: 'b'},
                ...this.config.support.links,
            ];
        },
    }
}
