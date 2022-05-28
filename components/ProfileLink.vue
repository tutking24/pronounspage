<template>
    <span>
        <Icon :v="niceLink.icon" :set="niceLink.iconSet || 'l'"/>
        <a :href="linkTrimmed" target="_blank" :rel="verifiedBy ? 'me' : 'noopener'">{{niceLink.text}}</a>
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
</style>
