<template>
    <ul>
        <template v-for="version in versions">
            <li v-for="(ordinalDesc, ordinal) in config.names.countOrdinal" class="my-1">
                <strong>
                    {{version}}
                    <small v-if="ordinalDesc">({{ ordinalDesc }})</small>:
                </strong>
                <span v-for="(icon, key) in config.names.countSex" :key="key" class="badge badge-light badge-big border mx-1">
                    <Icon :v="icon"/>
                    {{ count(version, key, ordinal) }}
                </span>
            </li>
        </template>
    </ul>
</template>

<script>
    import nameCount from '../data/names/nameCount';

    export default {
        props: {
            name: { required: true },
        },
        computed: {
            versions() {
                return this.name.split('/');
            },
        },
        methods: {
            count(name, sex, ordinal) {
                const counts = nameCount[name.toUpperCase()];
                if (counts === undefined) {
                    return 0;
                }

                return counts[sex][parseInt(ordinal) - 1];
            },
        }
    };
</script>

<style lang="scss" scoped>
    .badge-big {
        font-size: 1em;
        font-weight: normal;
    }
</style>
