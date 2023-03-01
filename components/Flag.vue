<template>
    <span class="flag-wrapper">
        <a v-if="link" :href="link.startsWith('http') ? link : `/${config.nouns.route}/${config.terminology.route}#${link.toLowerCase()}`" target="_blank" rel="noopener" :title="alt">
            <img v-if="missing === false" :src="img" :alt="alt" class="flag-mini rounded" @error="missing = true"/>
            <LocaleLink locale="en" v-else link="/blog/missing-flags" class="text-danger"><Icon v="exclamation-circle"/></LocaleLink>
            <Spelling escape :text="name"/><sup v-if="custom" class="text-muted"><small><Icon v="user"/></small></sup><sup v-if="asterisk" class="text-muted"><small>*</small></sup>
        </a>
        <span v-else :title="alt">
            <img v-if="missing === false" :src="img" :alt="alt" class="flag-mini rounded" @error="missing = true"/>
            <LocaleLink locale="en" v-else link="/blog/missing-flags" class="text-danger"><Icon v="exclamation-circle"/></LocaleLink>
            <Spelling escape :text="name"/><sup v-if="custom" class="text-muted"><small><Icon v="user"/></small></sup><sup v-if="asterisk" class="text-muted"><small>*</small></sup>
        </span>
        <span class="flag-preview bg-white rouded p-2 border">
            <img v-if="missing === false" :src="img" :alt="alt" class="rounded" @error="missing = true"/>
            <LocaleLink locale="en" v-else link="/blog/missing-flags" class="text-danger"><Icon v="exclamation-circle"/></LocaleLink>
            <span v-if="asterisk" class="alert alert-warning small d-block-force mt-2 mb-0 p-2">
                *
                <T>profile.flagsAsterisk</T>
            </span>
            <span v-if="custom" class="alert alert-warning small d-block-force mt-2 mb-0 p-2">
                <Icon v="user"/>
                <T>profile.flagsCustomWarning</T>
            </span>
            <span v-if="description" class="d-block-force alert p-2"><strong>{{name}}</strong> — {{description}}</span>
            <span v-if="alt" class="d-block-force alert p-2 small mb-0 text-muted"><T>crud.alt</T><T>quotation.colon</T> {{alt}}</span>
        </span>
    </span>
</template>

<script>
    export default {
        props: {
            termkey: { required: true },
            name: { required: true },
            alt: { required: true },
            img: { required: true },
            description: { },
            customlink: { },
            terms: { },
            custom: { type: Boolean },
            asterisk: { type: Boolean },
        },
        data() {
            return {
                missing: false,
            }
        },
        computed: {
            link() {
                if (this.customlink) {
                    return this.customlink;
                }

                if (!this.config.terminology.enabled || !(this.config.terminology.published || this.$isGranted('terms'))) {
                    return null;
                }

                let fallback = null;

                for (let term of this.terms || []) {
                    // exact match
                    if (term.key && term.key.toLowerCase() === this.termkey.toLowerCase()) {
                        return term.key;
                    }
                    if (term.term.toLowerCase() === this.name.toLowerCase()) {
                        return this.name;
                    }
                    if (term.original.toLowerCase() === this.termkey.toLowerCase()) {
                        return this.termkey;
                    }

                    // fallback
                    if (term.key && term.key.toLowerCase().includes(this.termkey.toLowerCase())) {
                        fallback = term.key;
                    }
                    if (term.term.toLowerCase().includes(this.name.toLowerCase())) {
                        fallback = this.name;
                    }
                    if (term.original.toLowerCase().includes(this.termkey.toLowerCase())) {
                        fallback = this.termkey;
                    }
                }

                return fallback;
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

        text-align: left;
        font-weight: normal;

        &:hover {
            .flag-preview {
                display: block;
                span {
                    white-space: normal;
                }
            }
        }
    }
</style>
