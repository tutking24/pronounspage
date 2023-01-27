<template>
    <span class="text-nowrap">
        <Icon :v="niceLink.icon" :set="niceLink.iconSet || 'l'"/>
        <a :href="linkTrimmed" target="_blank" :rel="verifiedBy ? 'me' : 'noopener'" class="link-ellipsis">{{niceLink.text}}</a>
        <button class="btn btn-sm p-0" v-if="verifiedBy" @click="verificationInfo">
            <Icon v="shield-check" set="s" class="small text-primary"/>
        </button>
    </span>
</template>

<script>
    import link from '../plugins/link';

    export default {
        mixins: [link],
        props: {
            link: { required: true },
            metadata: {},
            expand: { type: Boolean },
            verifiedLinks: { 'default': () => {return {}} },
        },
        computed: {
            linkTrimmed() {
                return this.link.trim();
            },
            niceLink() {
                return this.beautifyLink(this.linkTrimmed, this.expand, this.verifiedBy, this.metadata);
            },
            verifiedBy() {
                return this.verifiedLinks[this.link];
            },
        },
        methods: {
            async verificationInfo() {
                await this.$alert({
                    icon: 'shield-check',
                    header: this.$t('profile.verifiedLinks.header'),
                    message: this.$t('profile.verifiedLinks.info')
                });
            },
        },
    };
</script>

<style lang="scss" scoped>
    .icon {
        height: 1em;
    }
    .link-ellipsis {
        overflow: hidden;
        display: inline-block;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 100%;
        line-height: 1em;
        vertical-align: middle;
    }
</style>
