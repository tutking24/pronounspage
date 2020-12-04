<template>
    <div v-if="notEmpty">
        <slot></slot>
        <ul class="list-unstyled">
            <li v-for="source in sources" v-if="isVisible(source)" class="my-2">
                <Source :source="source"/>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        props: {
            sources: { required: true },
            filter: { default: '' },
            filterType: { default: '' },
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
        },
        computed: {
            notEmpty() {
                return this.sources.filter(this.isVisible).length > 0;
            },
        },
    }
</script>
