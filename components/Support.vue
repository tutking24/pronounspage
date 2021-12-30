<template>
    <section>
        <h3>
            <Icon v="people-carry"/>
            <T>support.header</T>
        </h3>
        <p><T>support.description</T></p>
        <p>
            <a v-for="link in links" :key="link.url"
               :href="link.url" target="_blank" rel="noopener"
               class="btn btn-outline-primary border m-1">
                <Icon :v="link.icon" :set="link.iconSet || 'l'"/>
                {{link.headline}}
            </a>
        </p>
        <p class="small">
            <Financial/>
        </p>
    </section>
</template>

<script>
    import {getSupportLinks} from '../src/contact';

    export default {
        data() {
            return {
                links: [...getSupportLinks(this.config)],
            }
        },
    }
</script>
