<template>
    <div class="my-2" v-if="!deleted">
        <h3 class="h6">
            <Icon :v="source.icon()"/>
            <strong><template v-if="source.author">{{source.author.replace('^', '')}}</template><span v-if="source.author"> – </span><em><a v-if="source.link" :href="source.link" target="_blank" rel="noopener" v-html="addMarks(source.title)"></a><span v-else v-html="addMarks(source.title)"></span></em></strong><template v-if="source.extra"> ({{source.extra}})</template>, {{source.year}}<template v-if="source.comment">; {{source.comment}}</template>
        </h3>
        <ul class="list-inline" v-if="manage && $isGranted('sources')">
            <li v-if="!source.approved" class="list-inline-item">
                <span class="badge badge-danger">
                    <Icon v="map-marker-question"/>
                    <T>nouns.pending</T>
                </span>
            </li>
            <!--
            <li v-if="source.submitter" class="list-inline-item">
                <nuxt-link :to="`/@${source.submitter}`" class="badge badge-light border btn-sm m-1">
                    <Icon v="user"/>
                    <span class="btn-label">
                        <T>crud.author</T>:
                        @{{source.submitter}}
                    </span>
                </nuxt-link>
            </li>
            -->
            <li v-if="!source.approved" class="list-inline-item">
                <a href="#" class="badge badge-success btn-sm m-1" @click.prevent="approve()">
                    <Icon v="check"/>
                    <span class="btn-label"><T>crud.approve</T></span>
                </a>
            </li>
            <li v-else class="list-inline-item">
                <a href="#" class="badge badge-light border border-secondary btn-sm m-1" @click.prevent="hide()">
                    <Icon v="times"/>
                    <span class="btn-label"><T>crud.hide</T></span>
                </a>
            </li>
            <li class="list-inline-item">
                <a href="#" class="badge badge-light border border-danger btn-sm m-1" @click.prevent="remove()">
                    <Icon v="trash"/>
                    <span class="btn-label"><T>crud.remove</T></span>
                </a>
            </li>
            <li class="list-inline-item">
                <a href="#" class="badge badge-light border border-primary btn-sm m-1" @click.prevent="$emit('edit-source', source)">
                    <Icon v="pen"/>
                    <span class="btn-label">
                        <T>crud.edit</T>
                    </span>
                </a>
            </li>
            <li class="list-inline-item">
                <span v-for="p in source.pronouns" :class="['badge', pronounLibrary.isCanonical(p) ? 'badge-success' : 'badge-danger']">
                    {{p}}
                </span>
            </li>
            <li class="list-inline-item" v-if="source.key">
                <span class="badge badge-primary">
                    <T>sources.submit.key</T>: {{source.key}}
                </span>
            </li>
        </ul>
        <div v-if="source.images.length" class="source-images">
            <ImageThumb v-for="image in source.images" :key="image" :id="image" class="m-2"/>
        </div>
        <ul v-if="source.fragments.length">
            <li v-for="fragment in source.fragments">
                <T>quotation.start</T><span v-html="addMarks(fragment.replace(/\n/g, '<br/>'))"></span><T>quotation.end</T>
            </li>
        </ul>
        <div v-if="source.versions.length" class="my-3">
            <p>
                <button :class="['btn', versionsShown ? 'btn-primary' : 'btn-outline-primary', 'btn-sm']" @click="versionsShown = !versionsShown">
                    <Icon v="language"/>
                    <T>sources.otherVersions</T>
                    <Icon :v="versionsShown ? 'caret-up' : 'caret-down'"/>
                </button>
            </p>
            <ul v-if="versionsShown">
                <li v-for="version in source.versions">
                    <h4 class="h6 mb-2">
                        <strong>
                            <a :href="`${locales[version.locale].url}/${version.pronouns[0]}`" target="_blank" rel="noopener">{{locales[version.locale].name}}</a>:
                        </strong>
                    </h4>
                    <Source :source="version"/>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import {pronounLibrary} from "../src/data";

    export default {
        name: 'Source',
        props: {
            source: { required: true },
            manage: { type: Boolean },
        },
        data() {
            return {
                pronounLibrary,
                deleted: false,
                versionsShown: false,
            }
        },
        methods: {
            async approve() {
                await this.$axios.$post(`/sources/approve/${this.source.id}`);
                this.source.approved = true;
                this.source.base = null;
                this.$forceUpdate();
            },
            async hide() {
                await this.$axios.$post(`/sources/hide/${this.source.id}`);
                this.source.approved = false;
                this.$forceUpdate();
            },
            async remove() {
                await this.$confirm(this.$t('crud.removeConfirm'), 'danger');

                await this.$axios.$post(`/sources/remove/${this.source.id}`);
                this.deleted = true;
                this.$forceUpdate();
            },
            addMarks(t) {
                return t.replace(/\[\[/g, '<mark>').replace(/]]/g, '</mark>');
            }
        },
    }
</script>

<style lang="scss" scoped>
    @import "assets/variables";

    @include media-breakpoint-down('sm', $grid-breakpoints) {
        .source-images {
            text-align: center;
        }
    }

    @include media-breakpoint-up('md', $grid-breakpoints) {
        .source-images {
            float: right;
            max-width: 18rem;
        }
    }
</style>
