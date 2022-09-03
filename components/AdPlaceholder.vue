<template>
    <div v-if="config.ads && config.ads.enabled"
         :id="`ezoic-pub-ad-placeholder-${phid}`"
         :class="[adPlaceholdersVisible ? 'ad-placeholder' : '']"
         v-html="adPlaceholdersVisible ? `${phkey} / ${phid}` : ''">
    </div>
</template>

<script>
import adPlaceholders from "../src/adPlaceholders";
import {mapState} from "vuex";

export default {
    props: {
        phkey: {required: true},
    },
    data() {
        return {
            phid: adPlaceholders[this.phkey],
        }
    },
    computed: {
        ...mapState([
            'adPlaceholdersVisible',
        ]),
    },
}
</script>

<style lang="scss" scoped>
.ad-placeholder {
    background-color: #b2caec;
    width: 100%;
    height: 80px;
    padding: 1em;
    text-align: center;
}
</style>
