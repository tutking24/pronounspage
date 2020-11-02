<template>
    <Loading :value="nounsRaw">
        <section v-if="$admin()" class="px-3">
            <div class="alert alert-info">
                <strong>{{ nounsCountApproved() }}</strong> <T>nouns.approved</T>,
                <strong>{{ nounsCountPending() }}</strong> <T>nouns.pending</T>.
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

        <Table :data="visibleNouns()" :columns="$admin() ? 4 : 3" :marked="(el) => !el.approved" fixed ref="dictionarytable">
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
                <th v-if="$admin()"></th>
            </template>

            <template v-slot:row="s"><template v-if="s">
                <td>
                    <ul class="list-singular">
                        <li v-for="w in s.el.masc">{{ w }}</li>
                    </ul>
                    <ul v-if="config.nouns.plurals" class="list-plural">
                        <li v-for="w in s.el.mascPl">{{ w }}</li>
                    </ul>

                    <small v-if="s.el.base && nouns[s.el.base]">
                        <p><strong><T>nouns.edited</T>:</strong></p>
                        <ul class="list-singular">
                            <li v-for="w in nouns[s.el.base].masc">{{ w }}</li>
                        </ul>
                        <ul v-if="config.nouns.plurals" class="list-plural">
                            <li v-for="w in nouns[s.el.base].mascPl">{{ w }}</li>
                        </ul>
                    </small>

                    <button v-if="!$admin()" class="btn btn-outline-primary btn-sm m-1 hover-show" @click="edit(s.el)">
                        <Icon v="pen"/>
                        <T>nouns.edit</T>
                    </button>
                </td>
                <td>
                    <ul class="list-singular">
                        <li v-for="w in s.el.fem">{{ w }}</li>
                    </ul>
                    <ul v-if="config.nouns.plurals" class="list-plural">
                        <li v-for="w in s.el.femPl">{{ w }}</li>
                    </ul>

                    <small v-if="s.el.base && nouns[s.el.base]">
                        <p><strong><T>nouns.edited</T>:</strong></p>
                        <ul class="list-singular">
                            <li v-for="w in nouns[s.el.base].fem">{{ w }}</li>
                        </ul>
                        <ul v-if="config.nouns.plurals" class="list-plural">
                            <li v-for="w in nouns[s.el.base].femPl">{{ w }}</li>
                        </ul>
                    </small>
                </td>
                <td>
                    <ul class="list-singular">
                        <li v-for="w in s.el.neutr">
                            <Declension v-if="config.nouns.declension" :word="w"/>
                            <template v-else>{{w}}</template>
                        </li>
                    </ul>
                    <ul v-if="config.nouns.plurals" class="list-plural">
                        <li v-for="w in s.el.neutrPl">
                            <Declension v-if="config.nouns.declension" :word="w" plural :singularOptions="s.el.neutr"/>
                            <template v-else>{{w}}</template>
                        </li>
                    </ul>

                    <small v-if="s.el.base && nouns[s.el.base]">
                        <p><strong><T>nouns.edited</T>:</strong></p>
                        <ul class="list-singular">
                            <li v-for="w in nouns[s.el.base].neutr">{{ w }}</li>
                        </ul>
                        <ul v-if="config.nouns.plurals" class="list-plural">
                            <li v-for="w in nouns[s.el.base].neutrPl">{{ w }}</li>
                        </ul>
                    </small>
                </td>
                <td v-if="$admin()">
                    <ul class="list-unstyled">
                        <li v-if="!s.el.approved">
                            <button class="btn btn-success btn-sm m-1" @click="approve(s.el)">
                                <Icon v="check"/>
                                <T>crud.approve</T>
                            </button>
                        </li>
                        <li v-else @click="hide(s.el)">
                            <button class="btn btn-outline-secondary btn-sm m-1">
                                <Icon v="times"/>
                                <T>crud.hide</T>
                            </button>
                        </li>
                        <li>
                            <button class="btn btn-outline-danger btn-sm m-1" @click="remove(s.el)">
                                <Icon v="trash"/>
                                <T>crud.remove</T>
                            </button>
                        </li>
                        <li>
                            <button class="btn btn-outline-primary btn-sm m-1" @click="edit(s.el)">
                                <Icon v="pen"/>
                                <T>crud.edit</T>
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
                <NounSubmitForm ref="form"/>
            </div>
        </template>
    </Loading>
</template>

<script>
    import { Noun } from "~/src/classes";
    import { buildDict } from "../src/helpers";

    export default {
        props: {
            load: {type: Boolean}
        },
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
                this.nounsRaw = await this.$axios.$get(`/nouns/all/${this.config.locale}`);
            },
            async setFilter(filter) {
                this.filter = filter;
                await this.loadNouns();
                this.focus();
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
                await this.$axios.$post(`/nouns/approve/${noun.id}`);
                if (noun.base) {
                    delete this.nouns[noun.base];
                }
                noun.approved = true;
                noun.base = null;
                this.$forceUpdate();
            },
            async hide(noun) {
                await this.$axios.$post(`/nouns/hide/${noun.id}`);
                noun.approved = false;
                this.$forceUpdate();
            },
            async remove(noun) {
                if (!confirm('Czy na pewno usunąć ten wpis?')) {
                    return false;
                }
                await this.$axios.$post(`/nouns/remove/${noun.id}`);
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

                return buildDict(function* (that) {
                    const sorted = that.nounsRaw.sort((a, b) => {
                        if (a.approved && !b.approved) {
                            return 1;
                        }
                        if (!a.approved && b.approved) {
                            return -1;
                        }
                        return a.masc.toLowerCase().localeCompare(b.masc.toLowerCase());
                    });
                    for (let w of sorted) {
                        yield [w.id, new Noun(w)];
                    }
                }, this);
            },
        },
        watch: {
            filter() {
                if (process.client) {
                    if (this.filter) {
                        window.location.hash = this.filter;
                    } else {
                        history.pushState('', document.title, window.location.pathname + window.location.search);
                    }
                    if (this.$refs.dictionarytable) {
                        this.$refs.dictionarytable.reset();
                        this.$refs.dictionarytable.focus();
                    }
                }
            }
        },
    }
</script>

<style lang="scss">
    @import "assets/style";

    .list-singular {
        padding-left: 0;
        list-style: none;
        li {
            white-space: nowrap;
        }
        >li:before {
            content: "⋅";
            display: inline-block;
            width: $fa-fw-width;
            text-align: center;
        }
    }
    .list-plural {
        padding-left: 0;
        list-style: none;
        li {
            white-space: nowrap;
        }
        >li:before {
            content: "⁖";
            display: inline-block;
            width: $fa-fw-width;
            text-align: center;
        }
    }

    tr {
        .hover-show {
            opacity: 0;
        }
        &:hover .hover-show {
            opacity: 1;
        }
    }
</style>
