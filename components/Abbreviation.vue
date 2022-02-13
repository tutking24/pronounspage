<template>
    <span>
        <template v-for="(meaning, abbr) in abbrs"><abbr v-if="meaning" :title="meaning">{{abbr}}</abbr><span v-else>{{abbr}}</span>&nbsp;</template><slot v-bind:abbrs="abbrs" v-bind:word="word"></slot>
    </span>
</template>

<script>
import { abbreviations } from '../src/data';

export default {
    props: {
        v: {required: true},
    },
    data() {
        const abbrs = {};
        let word = this.v.trim();
        let m = null;
        while ((m = word.match(/^(\w+\.?) /)) !== null) {
            const abbr = m[1];
            abbrs[abbr] = abbreviations[abbr] || null;
            word = word.substring(abbr.length + 1).trim();
        }

        return { abbrs, word };
    },
}
</script>

<style lang="scss" scoped>
@import "assets/variables";

abbr {
    text-decoration-color: $text-muted;
}
</style>
