<template>
    <div v-if="config.ads && config.ads.enabled"
         :id="`ezoic-pub-ad-placeholder-${phid}`"
         :class="[dev ? 'ad-placeholder' : '']"
         v-html="dev ? `${phkey} / ${phid}` : ''">
    </div>
</template>

<script>
import adPlaceholders from "../src/adPlaceholders";

export default {
    props: {
        phkey: {required: true},
    },
    data() {
        return {
            dev: process.env.NODE_ENV === 'development',
            phid: adPlaceholders[this.phkey],
        }
    }
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
