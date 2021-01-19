<template>
    <a v-if="link" :href="`/${config.nouns.route}/${config.nouns.terms.route}#${link.toLowerCase()}`" :title="alt">
        <img :src="img" alt=""/>
        {{ name }}
    </a>
    <span v-else :title="alt">
        <img :src="img" alt=""/>
        {{ name }}
    </span>
</template>

<script>
    export default {
        props: {
            name: { required: true },
            alt: { required: true },
            img: { required: true },
            terms: { },
        },
        computed: {
            link() {
                if (!this.config.nouns.terms.enabled) {
                    return null;
                }

                for (let term of this.terms || []) {
                    if (term.term.toLowerCase().includes(this.name.toLowerCase())) {
                        return this.name;
                    }
                    if (term.original.toLowerCase().includes(this.alt.toLowerCase())) {
                        return this.alt;
                    }
                }

                return null;
            },
        },
    }
</script>

<style lang="scss" scoped>
    img {
        height: 1rem;
    }
</style>
