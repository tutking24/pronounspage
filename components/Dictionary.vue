<template>
    <Loading :value="nounsRaw">
        <section v-if="$isGranted('nouns')" class="px-3">
            <div class="alert alert-info">
                <strong>{{ nounsCountApproved() }}</strong> <T>nouns.approved</T>,
                <strong>{{ nounsCountPending() }}</strong> <T>nouns.pending</T>.
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
                <button class="btn btn-success" @click="$refs.form.$el.scrollIntoView({block: 'center'})">
                    <Icon v="plus-circle"/>
                    <T>nouns.submit.action</T>
                </button>
            </div>
        </section>

        <Table :data="visibleNouns()" :columns="3" :marked="(el) => !el.approved" fixed ref="dictionarytable">
            <template v-slot:header>
                <th class="text-nowrap">
                    <Icon v="mars"/>
                    <T>nouns.masculine</T>
                </th>
                <th class="text-nowrap">
                    <Icon v="venus"/>
                    <T>nouns.feminine</T>
                </th>
                <th class="text-nowrap">
                    <Icon v="neuter"/>
                    <T>nouns.neuter</T>
                </th>
                <th></th>
            </template>

            <template v-slot:row="s"><template v-if="s">
                <td>
                    <Noun :noun="s.el" gender="masc"/>

                    <small v-if="s.el.base && nouns[s.el.base]">
                        <p><strong><T>nouns.edited</T><T>quotation.colon</T></strong></p>
                        <Diff switchable>
                            <template v-slot:before><Noun :noun="nouns[s.el.base]" gender="masc"/></template>
                            <template v-slot:after><Noun :noun="s.el" gender="masc"/></template>
                        </Diff>
                    </small>
                </td>
                <td>
                    <Noun :noun="s.el" gender="fem"/>

                    <small v-if="s.el.base && nouns[s.el.base]">
                        <p><strong><T>nouns.edited</T><T>quotation.colon</T></strong></p>
                        <Diff switchable>
                            <template v-slot:before><Noun :noun="nouns[s.el.base]" gender="fem"/></template>
                            <template v-slot:after><Noun :noun="s.el" gender="fem"/></template>
                        </Diff>
                    </small>
                </td>
                <td>
                    <Noun :noun="s.el" gender="neutr"/>

                    <small v-if="s.el.base && nouns[s.el.base]">
                        <p><strong><T>nouns.edited</T><T>quotation.colon</T></strong></p>
                        <Diff switchable>
                            <template v-slot:before><Noun :noun="nouns[s.el.base]" gender="neutr"/></template>
                            <template v-slot:after><Noun :noun="s.el" gender="neutr"/></template>
                        </Diff>
                    </small>

                    <div v-if="s.el.sourcesData.length" class="div-three-columns">
                        <p><strong><T>sources.referenced</T><T>quotation.colon</T></strong></p>
                        <ul class="list-unstyled">
                            <li v-for="source in s.el.sourcesData">
                                <Source :source="source"/>
                            </li>
                        </ul>
                    </div>
                </td>
                <td>
                    <ul class="list-unstyled list-btn-concise">
                        <template v-if="$isGranted('nouns')">
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
                                    <T v-if="$isGranted('nouns')">crud.edit</T>
                                    <T v-else>nouns.edit</T>
                                </span>
                            </button>
                        </li>
                        <li>
                            <a :href="`/api/nouns/${s.el.id}.png`" target="_blank" rel="noopener"
                               class="btn btn-concise btn-outline-primary btn-sm m-1"
                            >
                                <Icon v="image"/>
                                <span class="btn-label">
                                    <T>nouns.image</T>
                                </span>
                            </a>
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

        <template v-if="config.nouns.submit">
            <Separator icon="plus"/>

            <div class="px-3">
                <NounSubmitForm ref="form" style="scroll-padding-top: 2rem;"/>
            </div>
        </template>
    </Loading>
</template>

<script>
    import { Noun } from "~/src/classes";
    import { buildDict } from "../src/helpers";
    import hash from "../plugins/hash";

    export default {
        props: {
            load: {type: Boolean}
        },
        mixins: [ hash ],
        data() {
            return {
                filter: '',
                nounsRaw: undefined,
            }
        },
        mounted() {
            if (this.load) {
                this.loadNouns();
            }
        },
        methods: {
            async loadNouns() {
                if (this.nounsRaw !== undefined) {
                    return;
                }
                this.nounsRaw = await this.$axios.$get(`/nouns`);
            },
            async setFilter(filter) {
                this.filter = filter;
                await this.loadNouns();
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
            edit(noun) {
                this.$refs.form.edit(noun);
            },
            async approve(noun) {
                await this.$post(`/nouns/approve/${noun.id}`);
                if (noun.base) {
                    delete this.nouns[noun.base];
                }
                noun.approved = true;
                noun.base = null;
                this.$forceUpdate();
            },
            async hide(noun) {
                await this.$post(`/nouns/hide/${noun.id}`);
                noun.approved = false;
                this.$forceUpdate();
            },
            async remove(noun) {
                await this.$confirm(this.$t('crud.removeConfirm'), 'danger');

                await this.$post(`/nouns/remove/${noun.id}`);
                delete this.nouns[noun.id];
                this.$forceUpdate();
            },

            // those must be methods, not computed, because when modified, they don't get updated in the view for some reason
            visibleNouns() {
                return Object.values(this.nouns).filter(n => n.matches(this.filter));
            },
            nounsCountApproved() {
                return Object.values(this.nouns).filter(n => n.approved).length;
            },
            nounsCountPending() {
                return Object.values(this.nouns).filter(n => !n.approved).length;
            },
        },
        computed: {
            nouns() {
                if (this.nounsRaw === undefined) {
                    return {};
                }

                const locale = this.config.locale;

                return buildDict(function* (that) {
                    const sorted = that.nounsRaw.sort((a, b) => {
                        if (a.approved && !b.approved) {
                            return 1;
                        }
                        if (!a.approved && b.approved) {
                            return -1;
                        }
                        return a.masc.toLowerCase().localeCompare(b.masc.toLowerCase(), locale);
                    });
                    for (let w of sorted) {
                        yield [w.id, new Noun(w)];
                    }
                }, this);
            },
        },
        watch: {
            filter() {
                this.setHash(this.config.nouns.hashNamespace || '', this.filter);
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

    .div-three-columns {
        width: 300%;
        position: relative;
        left: -200%;
    }
</style>
