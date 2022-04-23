<template>
    <span>
        <Icon :v="niceLink.icon" :set="niceLink.iconSet || 'l'"/>
        <a :href="linkTrimmed" target="_blank" :rel="verifiedBy ? 'me' : 'noopener'">
            {{niceLink.text}}
        </a>
        <small v-if="verifiedBy">
            <Icon v="shield-check" set="s" class="small text-primary"/>
        </small>
    </span>
</template>

<script>
    import link from '../plugins/link';

    export default {
        mixins: [link],
        props: {
            link: { required: true },
            expand: { type: Boolean },
            verifiedLinks: { 'default': () => {return {}} },
        },
        computed: {
            linkTrimmed() {
                return this.link.trim();
            },
            niceLink() {
                return this.beautifyLink(this.linkTrimmed, this.expand, this.verifiedBy);
            },
            verifiedBy() {
                return this.verifiedLinks[this.link];
            }
        }
    };
</script>

<style lang="scss" scoped>
    .icon {
        height: 1em;
    }
</style>
