<template>
    <div>
        <h2>
            <Icon v="signature"/>
            <T>names.headerLong</T>
        </h2>

        <section>
            <T>names.intro</T>
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
            </div>
        </section>

        <section>
            <ul class="list-group small">
                <template v-if="visibleNames().length">
                <li v-for="name in visibleNames()" class="list-group-item">
                    <h3>
                        {{ name.name }}
                    </h3>
                    <div class="d-flex flex-column flex-md-row">
                        <ul class="list-unstyled w-md-50">
                            <li v-if="name.origin" class="my-1">
                                <Icon v="map-marked-alt"/>
                                <strong><T>names.origin</T>:</strong>
                                {{ name.origin }}
                            </li>
                            <li v-if="name.meaning" class="my-1">
                                <Icon v="comment-exclamation"/>
                                <strong><T>names.meaning</T>:</strong>
                                <LinkedText :text="name.meaning"/>
                            </li>
                            <li v-if="name.usage" class="my-1">
                                <Icon v="user-friends"/>
                                <strong><T>names.usage</T>:</strong>
                                {{ name.usage }}
                            </li>
                            <li v-if="config.names.legally && name.legally" class="my-1">
                                <Icon v="file-contract"/>
                                <strong><T>names.legally</T>:</strong>
                                {{ name.legally }}
                            </li>
                            <li v-if="config.names.count && name.count" class="my-1">
                                <Icon v="users"/>
                                <strong><T>names.count</T>:</strong>
                                <NameCount :name="name.name"/>
                            </li>
                        </ul>
                        <ul class="list-unstyled w-md-50">
                            <li v-for="pro in name.pros" class="my-1">
                                <Icon v="plus-circle"/>
                                {{ pro }}
                            </li>
                            <li v-for="con in name.cons" class="my-1">
                                <Icon v="minus-circle"/>
                                {{ con }}
                            </li>
                            <li v-for="person in name.notablePeople" class="my-1">
                                <Icon v="user"/>
                                {{ person }}
                            </li>
                            <li v-for="link in name.links" class="my-1">
                                <Icon v="external-link"/>
                                <a :href="link.trim()" target="_blank" rel="noopener">{{ clearUrl(link) }}</a>
                            </li>
                        </ul>
                    </div>
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

        <ScrollButton/>
    </div>
</template>

<script>
    import { names } from '~/src/data';
    import { head, clearUrl } from '~/src/helpers';
    import hash from "../plugins/hash";

    export default {
        mixins: [ hash ],
        data() {
            return {
                names,
                clearUrl,
                filter: '',
            }
        },
        mounted() {
            this.handleHash('', filter => {
                this.filter = filter;
                this.$refs.filter.focus();
                this.$refs.filter.scrollIntoView();
                setTimeout(_ => {
                    this.$refs.filter.scrollIntoView();
                }, 1000);
            });
        },
        methods: {
            visibleNames() {
                return Object.values(this.names)
                    .filter(n => n.matches(this.filter))
                    .sort((a, b) => a.name.localeCompare(b.name));
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
</style>
