<template>
    <span>
        <abbr v-if="abbr" :title="meaning">{{abbr}}</abbr><template v-if="abbr">&nbsp;</template><slot v-bind:abbr="abbr" v-bind:meaning="meaning" v-bind:word="word"></slot>
    </span>
</template>

<script>
import { abbreviations } from '../src/data';

export default {
    props: {
        v: {required: true},
    },
    data() {
        for (let abbr in abbreviations) {
            if (!abbreviations.hasOwnProperty(abbr)) { continue; }
            if (this.v.startsWith(abbr + ' ')) {
                return {
                    abbr,
                    meaning: abbreviations[abbr],
                    word: this.v.substring(abbr.length + 1),
                };
            }
        }
        return {
            abbr: null,
            meaning: null,
            word: this.v,
        }
    },
}
</script>

<style lang="scss" scoped>
@import "assets/variables";

abbr {
    text-decoration-color: $text-muted;
}
</style>
