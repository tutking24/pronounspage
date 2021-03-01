<template>
    <Loading :value="entriesRaw">
        <section v-if="$isGranted('inclusive')" class="px-3">
            <div class="alert alert-info">
                <strong>{{ entriesCountApproved() }}</strong> <T>nouns.approved</T>,
                <strong>{{ entriesCountPending() }}</strong> <T>nouns.pending</T>.
            </div>
        </section>

        <section class="sticky-top">
            <div class="input-group mb-3 bg-white">
                <span class="input-group-text">
                    <Icon v="filter"/>
                </span>
                <input class="form-control border-primary" v-model="filter" :placeholder="$t('crud.filterLong')" ref="filter"/>
                <button v-if="filter" class="btn btn-outline-danger" @click="filter = ''; $refs.filter.focus()">
                    <Icon v="times"/>
                </button>
                <button class="btn btn-outline-success" @click="$refs.form.$el.scrollIntoView()">
                    <Icon v="plus-circle"/>
                    <T>nouns.submit.action</T>
                </button>
            </div>
        </section>

        <Table :data="visibleEntries()" :marked="(el) => !el.approved" fixed ref="dictionarytable">
            <template v-slot:header>
                <th class="text-nowrap">
                    <Icon v="comment-times"/>
                    <T>nouns.inclusive.insteadOf</T>
                </th>
                <th class="text-nowrap">
                    <Icon v="comment-check"/>
                    <T>nouns.inclusive.say</T>
                </th>
                <th class="text-nowrap">
                    <Icon v="comment-dots"/>
                    <T>nouns.inclusive.because</T>
                </th>
                <th></th>
            </template>

            <template v-slot:row="s"><template v-if="s">
                <td>
                    <ul class="list-untyled">
                        <li v-for="w in s.el.insteadOf" class="text-strike">{{w}}</li>
                    </ul>

                    <ul class="list-inline">
                        <li v-for="category in s.el.categories" class="list-inline-item">
                            <span class="badge bg-primary">
                                {{category}}
                            </span>
                        </li>
                    </ul>

                    <small v-if="s.el.base && entries[s.el.base]">
                        <p><strong><T>nouns.edited</T>:</strong></p>
                        <ul class="list-untyled">
                            <li v-for="w in entries[s.el.base].insteadOf" class="text-strike">{{w}}</li>
                        </ul>

                        <ul class="list-inline">
                            <li v-for="category in entries[s.el.base].categories" class="list-inline-item">
                            <span class="badge bg-primary">
                                {{category}}
                            </span>
                            </li>
                        </ul>
                    </small>
                </td>
                <td>
                    <ul class="list-untyled">
                        <li v-for="w in s.el.say">{{w}}</li>
                    </ul>

                    <small v-if="s.el.base && entries[s.el.base]">
                        <p><strong><T>nouns.edited</T>:</strong></p>
                        <ul class="list-untyled">
                            <li v-for="w in entries[s.el.base].say">{{w}}</li>
                        </ul>
                    </small>
                </td>
                <td>
                    <p v-for="p in s.el.because.split('\n\n')"><LinkedText :text="p"/></p>

                    <ul class="list-unstyled small">
                        <li v-for="link in s.el.links">
                            <a :href="link" target="_blank" rel="noopener">
                                <Icon v="external-link"/>
                                {{clearUrl(link)}}
                            </a>
                        </li>
                    </ul>

                    <small v-if="s.el.base && entries[s.el.base]">
                        <p><strong><T>nouns.edited</T>:</strong></p>
                        <p v-for="p in entries[s.el.base].because.split('\n\n')"><LinkedText :text="p"/></p>

                        <ul class="list-unstyled small">
                            <li v-for="link in entries[s.el.base].links">
                                <a :href="link" target="_blank" rel="noopener">
                                    <Icon v="external-link"/>
                                    {{clearUrl(link)}}
                                </a>
                            </li>
                        </ul>
                    </small>
                </td>
                <td>
                    <ul class="list-unstyled list-btn-concise">
                        <!--
                        <li v-if="s.el.author" class="small">
                            <nuxt-link :to="`/@${s.el.author}`" class="btn btn-concise btn-outline-dark btn-sm m-1">
                                <Icon v="user"/>
                                <span class="btn-label">
                                    <T>crud.author</T>:
                                    @{{s.el.author}}
                                </span>
                            </nuxt-link>
                        </li>
                        -->
                        <template v-if="$isGranted('inclusive')">
                            <li v-if="!s.el.approved">
                                <button class="btn btn-concise btn-success btn-sm m-1" @click="approve(s.el)">
                                    <Icon v="check"/>
                                    <span class="btn-label"><T>crud.approve</T></span>
                                </button>
                            </li>
                            <li v-else @click="hide(s.el)">
                                <button class="btn btn-concise btn-outline-secondary btn-sm m-1">
                                    <Icon v="times"/>
                                    <span class="btn-label"><T>crud.hide</T></span>
                                </button>
                            </li>
                            <li>
                                <button class="btn btn-concise btn-outline-danger btn-sm m-1" @click="remove(s.el)">
                                    <Icon v="trash"/>
                                    <span class="btn-label"><T>crud.remove</T></span>
                                </button>
                            </li>
                        </template>
                        <li>
                            <button class="btn btn-concise btn-outline-primary btn-sm m-1" @click="edit(s.el)">
                                <Icon v="pen"/>
                                <span class="btn-label">
                                    <T v-if="$isGranted('inclusive')">crud.edit</T>
                                    <T v-else>nouns.edit</T>
                                </span>
                            </button>
                        </li>
                    </ul>
                </td>
            </template></template>

            <template v-slot:empty>
                <Icon v="search"/>
                <T>nouns.empty</T>
            </template>
        </Table>

        <template v-if="config.nouns.submit">
            <Separator icon="plus"/>

            <div class="px-3">
                <InclusiveSubmitForm ref="form"/>
            </div>
        </template>
    </Loading>
</template>

<script>
    import { InclusiveEntry } from "~/src/classes";
    import { buildDict, clearUrl } from "../src/helpers";
    import hash from "../plugins/hash";

    export default {
        props: {
            load: {type: Boolean}
        },
        mixins: [ hash ],
        data() {
            return {
                filter: '',
                entriesRaw: undefined,
                clearUrl,
            }
        },
        mounted() {
            if (this.load) {
                this.loadEntries();
            }
        },
        methods: {
            async loadEntries() {
                if (this.entriesRaw !== undefined) {
                    return;
                }
                this.entriesRaw = await this.$axios.$get(`/inclusive`);
            },
            async setFilter(filter) {
                this.filter = filter;
                await this.loadEntries();
                this.focus();
            },
            focus() {
                this.$el.focus();
                this.$el.scrollIntoView();
                setTimeout(_ => {
                    this.$el.scrollIntoView();
                }, 1000);
            },
            edit(entry) {
                this.$refs.form.edit(entry);
            },
            async approve(entry) {
                await this.$axios.$post(`/inclusive/approve/${entry.id}`);
                if (entry.base) {
                    delete this.entries[entry.base];
                }
                entry.approved = true;
                entry.base = null;
                this.$forceUpdate();
            },
            async hide(entry) {
                await this.$axios.$post(`/inclusive/hide/${entry.id}`);
                entry.approved = false;
                this.$forceUpdate();
            },
            async remove(entry) {
                await this.$confirm(this.$t('crud.removeConfirm'), 'danger');

                await this.$axios.$post(`/inclusive/remove/${entry.id}`);
                delete this.entries[entry.id];
                this.$forceUpdate();
            },

            // those must be methods, not computed, because when modified, they don't get updated in the view for some reason
            visibleEntries() {
                return Object.values(this.entries).filter(n => n.matches(this.filter));
            },
            entriesCountApproved() {
                return Object.values(this.entries).filter(n => n.approved).length;
            },
            entriesCountPending() {
                return Object.values(this.entries).filter(n => !n.approved).length;
            },
        },
        computed: {
            entries() {
                if (this.entriesRaw === undefined) {
                    return {};
                }

                return buildDict(function* (that) {
                    const sorted = that.entriesRaw.sort((a, b) => {
                        if (a.approved && !b.approved) {
                            return 1;
                        }
                        if (!a.approved && b.approved) {
                            return -1;
                        }
                        return a.insteadOf.toLowerCase().localeCompare(b.insteadOf.toLowerCase());
                    });
                    for (let w of sorted) {
                        yield [w.id, new InclusiveEntry(w)];
                    }
                }, this);
            },
        },
        watch: {
            filter() {
                this.setHash(this.config.nouns.inclusive.hashNamespace || '', this.filter);
                if (this.$refs.dictionarytable) {
                    this.$refs.dictionarytable.reset();
                    this.$refs.dictionarytable.focus();
                }
            }
        },
    }
</script>

<style lang="scss">
    @import "assets/variables";

    tr {
        .hover-show {
            opacity: 0;
        }
        &:hover .hover-show {
            opacity: 1;
        }
    }

    .btn-concise {
        white-space: nowrap;
    }
    @include media-breakpoint-up('md', $grid-breakpoints) {
        .list-btn-concise {
            min-width: 3rem;

            li {
                height: 2.5rem;
            }
        }
        .btn-concise {
            position: absolute;

            .btn-label {
                display: none;
            }

            &:hover .btn-label {
                display: inline;
            }
        }
    }
</style>
