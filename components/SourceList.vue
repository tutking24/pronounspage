<template>
    <ul class="list-unstyled">
        <li v-for="source in sourcesSorted" v-if="!filter || filter === source.type" class="my-2">
            <Source :source="source"/>
        </li>
    </ul>
</template>

<script>
    import { sources } from '../src/data';
    import {Source} from "../src/classes";

    export default {
        props: {
            names: { required: true },
            filter: { default: '' },
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
                source.sortString = source.author || 'ZZZZ' + source.title; // if no author, put on the end
                if (source.sortString.includes('^')) {
                    const index = source.sortString.indexOf('^');
                    source.sortString = source.sortString.substring(index + 1) + ' ' + source.sortString.substring(0, index);
                }
                return source;
            }
        },
    }
</script>
