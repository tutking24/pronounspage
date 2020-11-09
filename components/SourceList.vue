<template>
    <div v-if="notEmpty">
        <slot></slot>
        <ul class="list-unstyled">
            <li v-for="source in sourcesSorted" v-if="isVisible(source)" class="my-2">
                <Source :source="source"/>
            </li>
        </ul>
    </div>
</template>

<script>
    import { sources } from '../src/data';
    import {Source} from "../src/classes";

    export default {
        props: {
            names: { required: true },
            filter: { default: '' },
            filterType: { default: '' },
        },
        data() {
            return {
                sourcesSorted: this.names
                    .map(name => this.addMetaData(sources[name]))
                    .sort((a, b) => {
                        if (a.typePriority !== b.typePriority) {
                            return b.typePriority - a.typePriority;
                        }

                        return a.sortString.localeCompare(b.sortString);
                    })
                ,
            };
        },
        methods: {
            addMetaData(source) {
                source.typePriority = Source.TYPES_PRIORITIES[source.type];

                source.sortString = source.author || 'ZZZZZ' + source.title; // if no author, put on the end
                if (source.sortString.includes('^')) {
                    const index = source.sortString.indexOf('^');
                    source.sortString = source.sortString.substring(index + 1) + ' ' + source.sortString.substring(0, index);
                }

                source.index = [
                    (source.author || '').replace('^', ''),
                    source.title,
                    source.extra,
                    source.year,
                    ...source.fragments,
                    source.comment,
                    source.link,
                ].join(' ').toLowerCase().replace(/<\/?[^>]+(>|$)/g, '');

                return source;
            },
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
                return this.sourcesSorted.filter(this.isVisible).length > 0;
            },
        },
    }
</script>
