<template>
    <section class="table-responsive">
        <table :class="['table table-striped table-hover', fixed ? 'table-fixed-' + columns : '']">
            <thead ref="thead">
            <tr>
                <td :colspan="columns">
                    <nav v-if="pages > 1">
                        <ul class="pagination pagination-sm justify-content-center mb-0">
                            <li v-for="p in pagesRange" :class="['page-item', p.page === page ? 'active' : '', p.enabled ? '' : 'disabled']">
                                <a v-if="p.enabled" class="page-link" href="#" @click.prevent="page = p.page">
                                    {{p.text}}
                                </a>
                                <span v-else class="page-link">
                                    {{p.text}}
                                </span>
                            </li>
                        </ul>
                    </nav>
                </td>
            </tr>
            <tr v-if="count && rowsCount">
                <td :colspan="columns">
                    <T>table.count</T><T>quotation.colon</T>
                    <strong>{{ rowsCount }}</strong>
                </td>
            </tr>
            <tr>
                <slot name="header"></slot>
            </tr>
            </thead>
            <tbody>
            <tr v-if="dataPage === undefined">
                <td :colspan="columns" class="text-center p-4">
                    <Spinner size="5rem"/>
                </td>
            </tr>
            <template v-else>
                <template v-if="rowsCount">
                    <tr v-for="el in dataPage" :key="el[rowKey]" :class="{'marked': marked ? marked(el) : false}">
                        <slot name="row" v-bind:el="el"></slot>
                    </tr>
                </template>
                <template v-else>
                    <tr>
                        <td :colspan="columns" class="text-center">
                            <slot name="empty">
                                <Icon v="search"/>
                                <T>table.empty</T>
                            </slot>
                        </td>
                    </tr>
                </template>
            </template>
            </tbody>
            <tfoot>
            <tr>
                <td :colspan="columns + 1">
                    <nav v-if="pages > 1">
                        <ul class="pagination pagination-sm justify-content-center">
                            <li v-for="p in pagesRange" :class="['page-item', p.page === page ? 'active' : '', p.enabled ? '' : 'disabled']">
                                <a v-if="p.enabled" class="page-link" href="#" @click.prevent="page = p.page">
                                    {{p.text}}
                                </a>
                                <span v-else class="page-link">
                                    {{p.text}}
                                </span>
                            </li>
                        </ul>
                    </nav>
                </td>
            </tr>
            </tfoot>
        </table>
    </section>
</template>

<script>
    export default {
        props: {
            endpoint: { required: true },
            query: { 'default': () => {return {}}},
            columns: { required: true },
            perPage: { 'default': 100 },
            rowKey: { 'default': 'id' },
            marked: {},
            fixed: { type: Boolean },
            count: { type: Boolean },
        },
        data() {
            return {
                page: 0,
                rowsCount: 0,
                dataPage: undefined,
            };
        },
        async mounted() {
            await this.loadData();
        },
        computed: {
            pages() {
                return Math.ceil(this.rowsCount / this.perPage);
            },
            pagesRange() {
                const vPages = [];
                vPages.push({page: 0, text: '«', enabled: this.page > 0});
                vPages.push({page: this.page - 1, text: '‹', enabled: this.page > 0});
                for (let i = 0; i < this.pages; i++) {
                    if (i <= 4 || (this.page - 3 <= i && i <= this.page + 3) || i >= this.pages - 3) {
                        vPages.push({page: i, text: i + 1, enabled: true});
                    } else if (vPages[vPages.length - 1].text !== '…') {
                        vPages.push({text: '…', enabled: false});
                    }
                }
                vPages.push({page: this.page + 1, text: '›', enabled: this.page < this.pages - 1});
                vPages.push({page: this.pages - 1, text: '»', enabled: this.page < this.pages - 1});
                return vPages;
            },
        },
        methods: {
            async loadData() {
                this.dataPage = undefined;
                const res = await this.$axios.$get(this.endpoint, {params: {
                    ...this.query,
                    limit: this.perPage,
                    offset: this.page * this.perPage,
                }});
                this.dataPage = res.data;
                this.rowsCount = res.count;
            },
            reset() {
                this.page = 0;
            },
            focus() {
                setTimeout(_ => {
                    this.$refs.thead.scrollIntoView();
                }, 300);
            },
        },
        watch: {
            async endpoint() {
                this.page = 0;
                await this.loadData();
            },
            async query() {
                this.page = 0;
                await this.loadData();
            },
            async page() {
                await this.loadData();
            },
        }
    }
</script>

<style lang="scss">
    @import "assets/variables";

    .marked {
        border-inline-start: 3px solid $primary;
    }
</style>
