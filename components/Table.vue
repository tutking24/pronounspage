<template>
    <section class="table-responsive">
        <table :class="['table table-striped table-hover', fixed ? 'table-fixed-' + columns : '']">
            <thead ref="thead">
            <tr>
                <slot name="header"></slot>
            </tr>
            </thead>
            <tbody>
            <template v-if="data.length">
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
            </tbody>
            <tfoot v-if="pages > 1">
            <tr>
                <td :colspan="columns">
                    <nav>
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
            data: { required: true },
            columns: { required: true },
            perPage: { 'default': 30 },
            rowKey: { 'default': 'id' },
            marked: {},
            fixed: { type: Boolean },
        },
        data() {
            return {
                page: 0,
            };
        },
        computed: {
            dataPage() {
                return this.data.slice(this.page * this.perPage, (this.page + 1) * this.perPage);
            },
            pages() {
                return Math.ceil(this.data.length / this.perPage);
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
            reset() {
                this.page = 0;
            },
            focus() {
                setTimeout(_ => {
                    this.$refs.thead.scrollIntoView();
                }, 300);
            },
        },
    }
</script>

<style lang="scss">
    @import "assets/style";

    .marked {
        border-left: 3px solid $primary;
    }
</style>
