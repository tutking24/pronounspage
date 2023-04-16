<template>
    <span v-if="op" :class="[ op.style, `colour-${op.colour}`]">
        <Tooltip :text="op.description">
            <Icon :v="op.icon"/>
        </Tooltip>
        <nuxt-link v-if="link" :to="link" :class="`colour-${op.colour || 'default'}`"><Spelling :escape="escape" :text="word"/></nuxt-link>
        <span v-else><Spelling :escape="escape" :text="word"/></span>
    </span>
</template>

<script>
    import opinions from '../src/opinions';

    export default {
        props: {
            word: { required: true },
            opinion: { required: true },
            link: {},
            escape: { type: Boolean, 'default': () => true },
            customOpinions: { 'default': () => { return {} }},
        },
        data() {
            return {
                op: this.findOpinion(),
            };
        },
        methods: {
            findOpinion() {
                if (opinions.hasOwnProperty(this.opinion)) {
                    return {
                        ...opinions[this.opinion],
                        description: this.$t(`profile.opinion.${this.opinion}`),
                    };
                }

                for (let op of Object.values(this.customOpinions)) {
                    if (op.icon === this.opinion) {
                        return op;
                    }
                }

                return null;
            },
        }
    }
</script>

<style lang="scss" scoped>
@import "assets/variables";

.small .fa-fw {
    width: #{$fa-fw-width / $small-font-size}em;
}
</style>
