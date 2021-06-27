<template>
    <span>
        <Icon :v="niceLink.icon" :set="niceLink.iconSet || 'l'"/>
        <a :href="linkTrimmed" target="_blank" rel="noopener">
            {{niceLink.text}}
        </a>
    </span>
</template>

<script>
    import link from '../plugins/link';

    export default {
        mixins: [link],
        props: {
            link: { required: true },
        },
        computed: {
            linkTrimmed() {
                return this.link.trim();
            },
            niceLink() {
                return this.beautifyLink(this.linkTrimmed);
            },
        }
    };
</script>

<style lang="scss" scoped>
    .icon {
        height: 1em;
    }
</style>
