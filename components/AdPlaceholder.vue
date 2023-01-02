\<template>
    <div v-if="config.ads && config.ads.enabled && active"
         :class="[adPlaceholdersVisible ? 'ad-placeholder' : '']">
        <span v-if="adPlaceholdersVisible">{{phkey}} / {{adConfig.slotId}}</span>
        <ins v-else class="adsbygoogle"
             style="display:block"
             data-ad-client="ca-pub-8518361481036191"
             :data-ad-slot="adConfig.slotId"
             :data-ad-format="adConfig.adFormat"
             :data-full-width-responsive="adConfig.responsive ? 'true' : ''"></ins>
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
        if (!adPlaceholders[this.phkey]) {
            return { active: false, adConfig: {} };
        }

        const [slotId, adFormat, responsive] = adPlaceholders[this.phkey];
        return {
            active: true,
            adConfig: {
                slotId,
                adFormat,
                responsive,
            }
        }
    },
    mounted() {
        if (!process.client) { return; }
        (window.adsbygoogle = window.adsbygoogle || []).push({});
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
