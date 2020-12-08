<template>
    <span :title="name">
        <img :src="src" alt=""/>
        {{ translatedName }}
    </span>
</template>

<script>
    export default {
        props: {
            name: { required: true },
            src: { required: true },
            pronoun: { required: true },
        },
        computed: {
            translatedName() {
                return this.pronoun.format(
                    this.$t(`flags.${this.name.replace(/ /g, '_')}`, {}, false) || this.name
                );
            },
        },
    }
</script>

<style lang="scss" scoped>
    img {
        height: 1rem;
    }
</style>
