<template>
    <div class="container">
        <h2>
            <Icon v="atom-alt"/>
            <T>nouns.headerLong</T>
        </h2>

        <section>
            <T>nouns.intro</T>

            <Share :title="$t('nouns.headerLong')"/>
        </section>

        <Separator icon="book-open"/>

        <Loading :value="nounsRaw">
            <section v-if="secret">
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

            <section class="table-responsive">
                <table :class="'table table-striped table-hover table-fixed-' + (secret ? 4 : 3)">
                    <thead>
                    <tr>
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
                        <th v-if="secret"></th>
                    </tr>
                    </thead>
                    <tbody>
                    <template v-if="visibleNouns().length">
                    <tr v-for="noun in visibleNouns()" :class="{'mark-left': !noun.approved}" :key="noun.id">
                        <td>
                            <ul class="list-singular">
                                <li v-for="w in noun.masc">{{ w }}</li>
                            </ul>
                            <ul class="list-plural">
                                <li v-for="w in noun.mascPl">{{ w }}</li>
                            </ul>

                            <small v-if="noun.base && nouns[noun.base]">
                                <p><strong><T>nouns.edited</T>:</strong></p>
                                <ul class="list-singular">
                                    <li v-for="w in nouns[noun.base].masc">{{ w }}</li>
                                </ul>
                                <ul class="list-plural">
                                    <li v-for="w in nouns[noun.base].mascPl">{{ w }}</li>
                                </ul>
                            </small>

                            <button v-if="!secret" class="btn btn-outline-primary btn-sm m-1 hover-show" @click="edit(noun)">
                                <Icon v="pen"/>
                                <T>nouns.edit</T>
                            </button>
                        </td>
                        <td>
                            <ul class="list-singular">
                                <li v-for="w in noun.fem">{{ w }}</li>
                            </ul>
                            <ul class="list-plural">
                                <li v-for="w in noun.femPl">{{ w }}</li>
                            </ul>

                            <small v-if="noun.base && nouns[noun.base]">
                                <p><strong><T>nouns.edited</T>:</strong></p>
                                <ul class="list-singular">
                                    <li v-for="w in nouns[noun.base].fem">{{ w }}</li>
                                </ul>
                                <ul class="list-plural">
                                    <li v-for="w in nouns[noun.base].femPl">{{ w }}</li>
                                </ul>
                            </small>
                        </td>
                        <td>
                            <ul class="list-singular">
                                <li v-for="w in noun.neutr">
                                    <Declension :word="w"/>
                                </li>
                            </ul>
                            <ul class="list-plural">
                                <li v-for="w in noun.neutrPl">
                                    <Declension :word="w" plural :singularOptions="noun.neutr"/>
                                </li>
                            </ul>

                            <small v-if="noun.base && nouns[noun.base]">
                                <p><strong><T>nouns.edited</T>:</strong></p>
                                <ul class="list-singular">
                                    <li v-for="w in nouns[noun.base].neutr">{{ w }}</li>
                                </ul>
                                <ul class="list-plural">
                                    <li v-for="w in nouns[noun.base].neutrPl">{{ w }}</li>
                                </ul>
                            </small>
                        </td>
                        <td v-if="secret">
                            <ul class="list-unstyled">
                                <li v-if="!noun.approved">
                                    <button class="btn btn-success btn-sm m-1" @click="approve(noun)">
                                        <Icon v="check"/>
                                        <T>crud.approve</T>
                                    </button>
                                </li>
                                <li v-else @click="hide(noun)">
                                    <button class="btn btn-outline-secondary btn-sm m-1">
                                        <Icon v="times"/>
                                        <T>crud.hide</T>
                                    </button>
                                </li>
                                <li>
                                    <button class="btn btn-outline-danger btn-sm m-1" @click="remove(noun)">
                                        <Icon v="trash"/>
                                        <T>crud.remove</T>
                                    </button>
                                </li>
                                <li>
                                    <button class="btn btn-outline-primary btn-sm m-1" @click="edit(noun)">
                                        <Icon v="pen"/>
                                        <T>crud.edit</T>
                                    </button>
                                </li>
                            </ul>
                        </td>
                    </tr>
                    </template>
                    <template v-else>
                        <tr>
                            <td :colspan="secret ? 4 : 3" class="text-center">
                                <Icon v="search"/>
                                <T>nouns.empty</T>
                            </td>
                        </tr>
                    </template>
                    </tbody>
                </table>
            </section>
        </Loading>

        <Separator icon="plus"/>

        <NounSubmitForm ref="form" :secret="secret"/>
    </div>
</template>

<script>
    import { Noun } from "~/src/classes";
    import { buildDict } from "../src/helpers";
    import { head } from "../src/helpers";

    export default {
        data() {
            return {
                filter: '',
                nounsRaw: undefined,
                secret: this.$route.query.secret,
            }
        },
        mounted() {
            if (process.client) {
                this.$axios.$get(`/nouns/all?secret=${this.$route.query.secret || ''}`).then(data => {
                    this.nounsRaw = data;
                });
                if (window.location.hash) {
                    this.filter = decodeURIComponent(window.location.hash.substr(1));
                    this.$refs.filter.focus();
                    this.$refs.filter.scrollIntoView();
                    setTimeout(_ => {
                        this.$refs.filter.scrollIntoView();
                    }, 1000);
                }
            }
        },
        methods: {
            edit(noun) {
                this.$refs.form.edit(noun);
            },
            async approve(noun) {
                await this.$axios.$post(`/nouns/approve/${noun.id}?secret=${this.secret || ''}`);
                if (noun.base) {
                    delete this.nouns[noun.base];
                }
                noun.approved = true;
                noun.base = null;
                this.$forceUpdate();
            },
            async hide(noun) {
                await this.$axios.$post(`/nouns/hide/${noun.id}?secret=${this.secret || ''}`);
                noun.approved = false;
                this.$forceUpdate();
            },
            async remove(noun) {
                if (!confirm('Czy na pewno usunąć ten wpis?')) {
                    return false;
                }
                await this.$axios.$post(`/nouns/remove/${noun.id}?secret=${this.secret || ''}`);
                delete this.nouns[noun.id];
                this.$forceUpdate();
            },
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
                }
            }
        },
        head() {
            return head({
                title: this.$t('nouns.headerLong'),
                description: this.$t('nouns.description'),
                banner: 'bannerNouns.png',
            });
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

    .mark-left {
        border-left: 3px solid $primary;
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
