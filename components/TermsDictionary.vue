<template>
    <Loading :value="entriesRaw">
        <section v-if="$isGranted('terms')" class="px-3">
            <div class="alert alert-info">
                <strong>{{ entriesCountApproved() }}</strong> <T>nouns.approved</T>,
                <strong>{{ entriesCountPending() }}</strong> <T>nouns.pending</T>.
            </div>
        </section>

        <section class="sticky-top">
            <div class="input-group bg-white text-filter">
                <span class="input-group-text">
                    <Icon v="filter"/>
                </span>
                <input class="form-control border-primary" v-model="filter" :placeholder="$t('crud.filterLong')" ref="filter"/>
                <button v-if="filter" class="btn btn-outline-danger" @click="filter = ''; $refs.filter.focus()">
                    <Icon v="times"/>
                </button>
                <button class="btn btn-success" @click="$refs.form.$el.scrollIntoView({block: 'center'})">
                    <Icon v="plus-circle"/>
                    <T>nouns.submit.action</T>
                </button>
            </div>
            <div class="btn-group mb-3 d-none d-md-flex bg-white category-filter">
                <button v-for="category in config.terminology.categories"
                    :class="['btn btn-sm', filter === ':' + category ? 'btn-primary' : 'btn-outline-primary']"
                    @click="filter = filter === ':' + category ? '' : ':' + category"
                >
                    <small><Spelling :text="category"/></small>
                </button>
            </div>
        </section>

        <Table :data="visibleEntries()" :columns="1" fixed :marked="(el) => !el.approved" ref="dictionarytable">
            <template v-slot:header>
                <th class="cell-wide"></th>
                <th></th>
            </template>

            <template v-slot:row="s"><template v-if="s">
                <td class="cell-wide">
                    <Term :term="s.el" categoryLink flags versions :events="year.eventsByTerm[s.el.key]" @filter="setFilter"/>

                    <div class="small" v-if="s.el.base && entries[s.el.base]">
                        <p><strong><T>nouns.edited</T><T>quotation.colon</T></strong></p>

                        <Diff switchable>
                            <template v-slot:before><Term :term="entries[s.el.base]" flags/></template>
                            <template v-slot:after><Term :term="s.el" flags/></template>
                        </Diff>
                    </div>
                </td>
                <td>
                    <ul class="list-unstyled list-btn-concise">
                        <template v-if="$isGranted('terms')">
                            <li v-if="s.el.author" class="small">
                                <nuxt-link :to="`/@${s.el.author}`" class="btn btn-concise btn-outline-dark btn-sm m-1">
                                    <Icon v="user"/>
                                    <span class="btn-label">
                                    <T>crud.author</T><T>quotation.colon</T>
                                    @{{s.el.author}}
                                </span>
                                </nuxt-link>
                            </li>
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

        <AdPlaceholder phkey="main-1"/>

        <Separator icon="plus"/>

        <div class="px-3">
            <TermsSubmitForm ref="form"/>
        </div>
    </Loading>
</template>

<script>
    import { TermsEntry } from "~/src/classes";
    import { buildDict, clearUrl, clearLinkedText } from "../src/helpers";
    import hash from "../plugins/hash";
    import { calendar } from '../src/calendar/calendar';

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
                year: calendar.getCurrentYear(),
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
                if (filter) {
                    this.focus();
                }
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
                await this.$post(`/terms/approve/${entry.id}`);
                if (entry.base) {
                    delete this.entries[entry.base];
                }
                entry.approved = true;
                entry.base = null;
                this.$forceUpdate();
            },
            async hide(entry) {
                await this.$post(`/terms/hide/${entry.id}`);
                entry.approved = false;
                this.$forceUpdate();
            },
            async remove(entry) {
                await this.$confirm(this.$t('crud.removeConfirm'), 'danger');

                await this.$post(`/terms/remove/${entry.id}`);
                delete this.entries[entry.id];
                this.$forceUpdate();
            },

            // those must be methods, not computed, because when modified, they don't get updated in the view for some reason
            visibleEntries() {
                const values = Object.values(this.entries).filter(n => n.matches(this.filter));
                if (this.filter) {
                    return values.sort((a, b) => {
                        if (a.key && a.key.toLowerCase() === this.filter.toLowerCase()) { return -1; }
                        if (b.key && b.key.toLowerCase() === this.filter.toLowerCase()) { return 1; }
                        if (a.term[0].toLowerCase() === this.filter.toLowerCase()) { return -1; }
                        if (b.term[0].toLowerCase() === this.filter.toLowerCase()) { return 1; }
                        return a.term[0].localeCompare(b.term[0]);
                    })
                }
                return values;
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
                        return clearLinkedText(a.term.toLowerCase()).localeCompare(
                            clearLinkedText(b.term.toLowerCase())
                        );
                    });
                    for (let w of sorted) {
                        yield [w.id, new TermsEntry(w)];
                    }
                }, this);
            },
        },
        watch: {
            filter() {
                this.setHash(this.config.terminology.hashNamespace || '', this.filter);
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
    @include media-breakpoint-down('md', $grid-breakpoints) {
        .cell-wide {
            min-width: 90vw;
        }
    }

    .flag {
        height: 96px;
    }

    @include media-breakpoint-up('md', $grid-breakpoints) {
        .text-filter {
            * {
                border-bottom-left-radius: 0;
                border-bottom-right-radius: 0;
            }
        }
    }
    .category-filter {
        margin-top: -1px;
        .btn {
            border-top-left-radius: 0;
            border-top-right-radius: 0;
        }
    }
</style>
