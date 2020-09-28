<template>
    <component :is="Array.isArray(txt) ? 'div' : 'span'">
        <template v-if="Array.isArray(txt)">
            <p v-for="p in txt">
                <LinkedText :text="p"/>
            </p>
        </template>
        <LinkedText v-else :text="txt"/>
    </component>
</template>

<script>
    import translations from '../data/pl/translations.suml';

    export default {
        data() {
            return {
                txt: this.translate(this.$slots.default[0].text),
            }
        },
        methods: {
            translate(key) {
                let value = translations;
                for (let part of key.split('.')) {
                    value = value[part];
                    if (value === undefined) {
                        return value;
                    }
                }
                return value;
            }
        },
    }
</script>
