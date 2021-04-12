<template>
    <span class="flag-wrapper">
        <a v-if="link" :href="`/${config.nouns.route}/${config.nouns.terms.route}#${link.toLowerCase()}`" :title="alt">
            <img :src="img" alt="" class="flag-mini rounded"/>
            <Spelling escape :text="name"/><sup v-if="custom" class="text-muted"><small><Icon v="user"/></small></sup>
        </a>
        <span v-else :title="alt">
            <img :src="img" alt="" class="flag-mini rounded"/>
            <Spelling escape :text="name"/><sup v-if="custom" class="text-muted"><small><Icon v="user"/></small></sup>
        </span>
        <span class="flag-preview bg-white rouded p-2 border">
            <img :src="img" alt="" class="rounded"/>
            <span v-if="custom" class="alert alert-warning small d-inline-block mt-2 mb-0 p-2">
                <Icon v="user"/>
                <T>profile.flagsCustomWarning</T>
            </span>
        </span>
    </span>
</template>

<script>
    export default {
        props: {
            name: { required: true },
            alt: { required: true },
            img: { required: true },
            terms: { },
            custom: { type: Boolean },
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
    .flag-mini {
        height: 1rem;
    }

    .flag-wrapper {
        position: relative;

        .flag-preview {
            position: absolute;
            top: 1.5em;
            left: 0;
            z-index: 999;
            display: none;
            img {
                max-height: 128px;
            }
        }

        &:hover {
            .flag-preview {
                display: block;
            }
        }
    }
</style>
