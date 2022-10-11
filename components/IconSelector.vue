<template>
    <div class="bg-light border rounded">
        <input class="form-control mb-1" v-model="filter" :placeholder="$t('crud.search')" ref="filter"/>
        <ul class="list-unstyled icons-list p-2 text-center">
            <li v-for="icon in visibleIcons"
                class="list-inline-item">
                <button class="btn btn-outline-dark border-0 my-2" @click.prevent="$emit('change', icon.name)">
                    <Icon :v="icon.name"/>
                </button>
            </li>
            <li v-if="!showAll && visibleIcons.length >= displayLimit" class="list-inline-item">
                <button class="btn btn-outline-dark border-0 my-2" @click.prevent="showAll = true">
                    <T>crud.loadAll</T>
                </button>
            </li>
        </ul>
    </div>
</template>

<script>
import icons from '../src/icons';

export default {
    props: {
        styles: { 'default': () => ['light'] },
        skipIcons: { 'default': () => [] },
    },
    data() {
        return {
            icons,
            filter: '',
            showAll: false,
            displayLimit: 27,
        }
    },
    mounted() {
        this.$refs.filter.focus();
    },
    computed: {
        visibleIcons() {
            return this.icons.filter(this.matches).slice(0, this.showAll ? undefined : this.displayLimit);
        }
    },
    methods: {
        matches(icon) {
            return !this.skipIcons.includes(icon.name)
                && icon.styles.filter(v => this.styles.includes(v)).length > 0
                && (
                    this.filter === ''
                    || icon.searchTerms.filter(t => t.includes(this.filter.toLowerCase())).length > 0
                )
            ;
        },
    },
}
</script>

<style lang="scss" scoped>
    .icons-list {
        height: 200px;
        overflow-y: auto;
    }
</style>
