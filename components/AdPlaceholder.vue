\<template>
    <div v-if="config.ads && config.ads.enabled && active"
         :class="[adPlaceholdersVisible ? 'ad-placeholder' : '']">
        <template v-if="adPlaceholdersVisible">
            <p class="text-center h5">{{phkey}}</p>
            <Debug :v="adConfig"/>
        </template>
        <ins v-else class="adsbygoogle"
             style="display:block"
             data-ad-client="ca-pub-8518361481036191"
             :data-ad-slot="adConfig.slotId"
             :data-ad-format="adConfig.adFormat"
             :data-ad-layout="adConfig.adLayout"
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

        const {slotId, adFormat, adLayout = null, responsive = false} = adPlaceholders[this.phkey];
        return {
            active: true,
            adConfig: {
                slotId,
                adFormat,
                adLayout,
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
    height: 200px;
    padding: 1em;
}
</style>
