<template>
    <Loading :value="entriesRaw">
        <section v-if="$isGranted('terms')" class="px-3">
            <div class="alert alert-info">
                <strong>{{ entriesCountApproved() }}</strong> <T>nouns.approved</T>,
                <strong>{{ entriesCountPending() }}</strong> <T>nouns.pending</T>.
            </div>
        </section>

        <section class="sticky-top">
            <div class="input-group mb-3 bg-white">
                <div class="input-group-prepend">
                    <span class="input-group-text">
                        <Icon v="filter"/>
                    </span>
                </div>
                <input class="form-control border-primary" v-model="filter" :placeholder="$t('crud.filterLong')" ref="filter"/>
                <div class="input-group-append" v-if="filter">
                    <button class="btn btn-outline-danger" @click="filter = ''; $refs.filter.focus()">
                        <Icon v="times"/>
                    </button>
                </div>
                <div class="input-group-append">
                    <button class="btn btn-outline-success" @click="$refs.form.$el.scrollIntoView()">
                        <Icon v="plus-circle"/>
                        <T>nouns.submit.action</T>
                    </button>
                </div>
            </div>
        </section>

        <Table :data="visibleEntries()" columns="1" fixed :marked="(el) => !el.approved" ref="dictionarytable">
            <template v-slot:header>
                <th></th>
                <th></th>
            </template>

            <template v-slot:row="s"><template v-if="s">
                <td>
                    <p>
                        <strong>{{s.el.term.join(', ')}}</strong>
                        <span v-if="s.el.original.length">({{s.el.original.join(', ')}})</span>
                        – {{s.el.definition}}
                    </p>

                    <p v-if="s.el.flags.length" class="text-center">
                        <img v-for="flag in s.el.flags" :src="`/flags/${flag}.png`" class="flag m-1"/>
                    </p>

                    <small v-if="s.el.base && entries[s.el.base]">
                        <p><strong><T>nouns.edited</T>:</strong></p>

                        <p>
                            <strong>{{s.el.term.join(', ')}}</strong>
                            <span v-if="s.el.original.length">({{s.el.original.join(', ')}})</span>
                            – {{s.el.definition}}
                        </p>
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
                        <template v-if="$$isGranted('terms')">
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
                                    <T v-if="$isGranted('terms')">crud.edit</T>
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
                <TermsSubmitForm ref="form"/>
            </div>
        </template>
    </Loading>
</template>

<script>
    import { TermsEntry } from "~/src/classes";
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
                this.entriesRaw = await this.$axios.$get(`/terms`);
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
                await this.$axios.$post(`/terms/approve/${entry.id}`);
                if (entry.base) {
                    delete this.entries[entry.base];
                }
                entry.approved = true;
                entry.base = null;
                this.$forceUpdate();
            },
            async hide(entry) {
                await this.$axios.$post(`/terms/hide/${entry.id}`);
                entry.approved = false;
                this.$forceUpdate();
            },
            async remove(entry) {
                await this.$confirm(this.$t('crud.removeConfirm'), 'danger');

                await this.$axios.$post(`/terms/remove/${entry.id}`);
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
                        return a.term.toLowerCase().localeCompare(b.term.toLowerCase());
                    });
                    for (let w of sorted) {
                        yield [w.id, new TermsEntry(w)];
                    }
                }, this);
            },
        },
        watch: {
            filter() {
                this.setHash(this.config.nouns.terms.hashNamespace || '', this.filter);
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

    .flag {
        height: 96px;
    }
</style>
