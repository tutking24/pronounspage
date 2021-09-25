<template>
    <div>
        <h2>
            <Icon v="signature"/>
            <T>names.headerLong</T>
        </h2>

        <section>
            <T>names.intro</T>
            <NamesLinks/>
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
                <button class="btn btn-outline-success" @click="$refs.form.$el.scrollIntoView({block: 'center'})">
                    <Icon v="plus-circle"/>
                    <T>nouns.submit.action</T>
                </button>
            </div>
        </section>

        <section>
            <ul class="list-group small">
                <template v-if="visibleNames().length">
                <li v-for="name in visibleNames()" :class="['list-group-item', name.approved ? '' : 'marked']">
                    <Name :name="name">
                        <ul class="list-inline small">
                            <template v-if="$isGranted('names')">
                                <li v-if="name.author" class="list-inline-item small">
                                    <nuxt-link :to="`/@${name.author}`" class="btn btn-outline-dark btn-sm">
                                        <Icon v="user"/>
                                        <span class="btn-label">
                                    <T>crud.author</T>:
                                    @{{name.author}}
                                </span>
                                    </nuxt-link>
                                </li>
                                <li v-if="!name.approved" class="list-inline-item">
                                    <button class="btn btn-success btn-sm" @click="approve(name)">
                                        <Icon v="check"/>
                                        <span class="btn-label"><T>crud.approve</T></span>
                                    </button>
                                </li>
                                <li v-else @click="hide(name)" class="list-inline-item">
                                    <button class="btn btn-outline-secondary btn-sm">
                                        <Icon v="times"/>
                                        <span class="btn-label"><T>crud.hide</T></span>
                                    </button>
                                </li>
                                <li class="list-inline-item">
                                    <button class="btn btn-outline-danger btn-sm" @click="remove(name)">
                                        <Icon v="trash"/>
                                        <span class="btn-label"><T>crud.remove</T></span>
                                    </button>
                                </li>
                            </template>
                            <li class="list-inline-item">
                                <button class="btn btn-outline-primary btn-sm" @click="edit(name)">
                                    <Icon v="pen"/>
                                    <span class="btn-label">
                                    <T v-if="$isGranted('names')">crud.edit</T>
                                    <T v-else>nouns.edit</T>
                                </span>
                                </button>
                            </li>
                        </ul>
                    </Name>

                    <small v-if="name.base && names[name.base]">
                        <hr/>
                        <p><strong><T>nouns.edited</T>:</strong></p>
                        <Name :name="names[name.base]"/>
                    </small>
                </li>
                </template>
                <template v-else>
                    <li class="list-group-item text-center">
                        <Icon v="search"/>
                        <T>names.empty</T>
                    </li>
                </template>
            </ul>
        </section>

        <Separator icon="plus"/>

        <section class="px-3">
            <NameSubmitForm ref="form" style="scroll-padding-top: 2rem;"/>
        </section>
    </div>
</template>

<script>
    import {head, buildDict} from '~/src/helpers';
    import hash from "../plugins/hash";
    import {Name} from "../src/classes";

    export default {
        mixins: [ hash ],
        data() {
            return {
                filter: '',
            }
        },
        async asyncData({app}) {
            return {
                namesRaw: await app.$axios.$get(`/names`),
            }
        },
        mounted() {
            this.handleHash('', filter => {
                this.filter = filter;
                if (filter) {
                    this.$refs.filter.focus();
                    this.$refs.filter.scrollIntoView();
                    setTimeout(_ => {
                        this.$refs.filter.scrollIntoView();
                    }, 1000);
                }
            });
        },
        computed: {
            names() {
                if (this.namesRaw === undefined) {
                    return {};
                }

                return buildDict(function* (that) {
                    const sorted = that.namesRaw.sort((a, b) => {
                        if (a.approved && !b.approved) {
                            return 1;
                        }
                        if (!a.approved && b.approved) {
                            return -1;
                        }
                        return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
                    });
                    for (let n of sorted) {
                        yield [n.id, new Name(n)];
                    }
                }, this);
            },
        },
        methods: {
            visibleNames() {
                return Object.values(this.names).filter(n => n.matches(this.filter));
            },
            edit(name) {
                this.$refs.form.edit(name);
            },
            async approve(name) {
                await this.$post(`/names/approve/${name.id}`);
                if (name.base) {
                    delete this.names[name.base];
                }
                name.approved = true;
                name.base = null;
                this.$forceUpdate();
            },
            async hide(name) {
                await this.$post(`/names/hide/${name.id}`);
                name.approved = false;
                this.$forceUpdate();
            },
            async remove(name) {
                await this.$confirm(this.$t('crud.removeConfirm'), 'danger');

                await this.$post(`/names/remove/${name.id}`);
                delete this.names[name.id];
                this.$forceUpdate();
            },
        },
        watch: {
            filter() {
                this.setHash('', this.filter);
            }
        },
        head() {
            return head({
                title: this.$t('names.headerLong'),
                description: this.$t('names.description'),
            });
        },
    }
</script>

<style lang="scss">
    @import "assets/variables";

    @include media-breakpoint-up('md') {
        .w-md-50 {
            width: 50%;
        }
    }

    .list-group-item.marked {
        border-inline-start: 3px solid $primary;
    }
</style>
