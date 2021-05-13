<template>
    <div v-if="notEmpty">
        <slot></slot>
        <div v-if="pronoun && pronoun.sourcesInfo" class="alert alert-info small">
            <Icon v="info-circle"/>
            <LinkedText :text="pronoun.sourcesInfo"/>
        </div>
        <ul class="list-unstyled">
            <li v-for="source in sources" :key="source.id" v-if="isVisible(source)" class="my-2 clearfix">
                <Source :source="source" :manage="manage" @edit-source="edit"/>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        props: {
            sources: { required: true },
            pronoun: { },
            filter: { default: '' },
            filterType: { default: '' },
            manage: { type: Boolean },
        },
        methods: {
            isVisible(source) {
                if (this.filterType && this.filterType !== source.type) {
                    return false;
                }

                if (this.filter) {
                    return source.index.includes(this.filter.toLowerCase());
                }

                return true;
            },
            edit(source) {
                // TODO it should be possible to do it nicer
                this.$emit('edit-source', source);
            }
        },
        computed: {
            notEmpty() {
                return this.sources.filter(this.isVisible).length > 0;
            },
        },
    }
</script>
