\<template>
    <div v-if="config.ads && config.ads.enabled && active"
         :class="[adPlaceholdersVisible ? 'ad-placeholder' : '']">
        <template v-if="adPlaceholdersVisible">
            <p class="text-center h5">{{phkey}}</p>
            <Debug :v="adConfig"/>
        </template>
        <ins v-else class="adsbygoogle"
             data-ad-client="ca-pub-8518361481036191"
             :data-ad-slot="adConfig.slotId"
             :data-ad-format="adConfig.adFormat"
             :data-ad-layout="adConfig.adLayout"
             :data-full-width-responsive="adConfig.responsive ? 'true' : ''"
             role="alert"
             :data-label="$t('support.ad')"></ins>
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

.adsbygoogle {
    display:block;
    &:not(:empty) {
        padding-block-start: .5em;
        padding-block-end: .5em;
        text-decoration: none;
        &:after {
            content: attr(data-label);
            display: block;
            font-size: 0.7rem;
        }
    }
}
</style>
