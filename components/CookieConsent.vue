<template>
    <div v-if="visible">
        <div :class="['modal', blur ? 'modal-shown d-block' : '']"></div>
        <div class="cc-modal bg-white border-top border-primary small">
            <div class="container py-3">
                <p class="d-flex justify-content-between">
                    <span class="h5">
                        <T>privacy.consent.header</T>
                    </span>
                </p>
                <div class="d-flex flex-column flex-lg-row">
                    <div>
                        <p class="h6"><T>privacy.consent.required.header</T></p>
                        <p class="mb-1"><T>privacy.consent.required.description</T></p>
                        <p><T>privacy.consent.required.details</T></p>
                    </div>
                    <div>
                        <p class="h6"><T>privacy.consent.optional.header</T></p>
                        <p class="mb-1"><T>privacy.consent.optional.description</T></p>
                        <p><T>privacy.consent.optional.details</T></p>
                    </div>
                    <div class="d-flex flex-column m-2">
                        <div class="d-flex flex-row flex-lg-column justify-content-center">
                            <button class="btn btn-primary m-1 text-nowrap" @click="setConsent(true)">
                                <Icon v="check"/>
                                <T>privacy.consent.accept</T>
                            </button>
                            <button class="btn btn-primary m-1 text-nowrap" @click="setConsent(false)">
                                <Icon v="times"/>
                                <T>privacy.consent.reject</T>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import adPlaceholders from "../src/adPlaceholders";

export default {
    data() {
        return {
            consent: this.$cookies.get('cookie-consent'),
            ezstandalone: undefined,
        }
    },
    async mounted() {
        if (!this.enabled || !process.client) { return; }
        await this.$loadScript('ezstandalone', `https://www.ezojs.com/ezoic/sa.min.js`);
        this.enableAds();
    },
    computed: {
        enabled() {
            return this.config.ads?.enabled;
        },
        visible() {
            return this.enabled && this.consent === undefined;
        },
        blur() {
            if (!this.enabled) { return false; }

            if ([this.config.user.privacyRoute, this.config.user.termsRoute].includes(this.$route.path.substr(1))) {
                return false;
            }

            return true;
        },
    },
    methods: {
        setConsent(v) {
            this.consent = v;
            this.$cookies.set('cookie-consent', v, {expires: new Date(+new Date + 365*24*60*60*1000)});
            this.enableAds();
        },
        enableAds() {
            if (this.consent === undefined) { return; }

            this.ezstandalone = window.ezstandalone || {};
            ezstandalone.cmd = ezstandalone.cmd || [];
            ezstandalone.cmd.push(() => {
                ezstandalone.setIsPWA();
                ezstandalone.setDisablePersonalizedStatistics(!this.consent);
                ezstandalone.setDisablePersonalizedAds(!this.consent);
                ezstandalone.define(Object.values(adPlaceholders));
                ezstandalone.enable();
                ezstandalone.display();
            });
        },
    },
    watch: {
        $route(to, from) {
            if (this.ezstandalone) {
                this.ezstandalone.refresh();
            }
        },
    }
}
</script>

<style lang="scss">
@import "assets/variables";

.cc-modal {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    z-index: 100002;
    box-shadow: 0 -.5rem 1rem rgba($black, .15);
}
</style>
