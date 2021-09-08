<template>
    <section>
        <h3>
            <Icon v="people-carry"/>
            <T>support.header</T>
        </h3>
        <p><T>support.description</T></p>
        <p>
            <a v-for="link in [...links, ...config.support.links]" :key="link.url"
               :href="link.url" target="_blank" rel="noopener"
               class="btn btn-outline-primary border m-1">
                <Icon :v="link.icon" :set="link.iconSet || 'l'"/>
                {{link.headline}}
            </a>
        </p>
    </section>
</template>

<script>
    export default {
        data() {
            return {
                links: [
                    {headline: 'Ko-Fi', url: 'https://ko-fi.com/radajezykaneutralnego', icon: 'coffee', },
                    {headline: 'PayPal', url: 'https://paypal.me/RJNeutralnego', icon: 'paypal', iconSet: 'b'},
                    {headline: 'BTC', url: 'https://www.blockchain.com/btc/address/1GFVeVZfYtPqDMAoCwK8WT2C4HjwiGxXS1', icon: 'bitcoin', iconSet: 'b'},
                ]
            }
        }
    }
</script>
