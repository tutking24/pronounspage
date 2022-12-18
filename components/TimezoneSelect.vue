<template>
    <div>
        <div class="input-group mb-3">
            <button class="btn btn-outline-primary" @click.prevent="detect">
                <Icon v="location"/>
                <T>profile.timezone.detect</T>
            </button>
            <AutocompleteSelect v-model="timezone" :options="timezones"/>
            <button v-if="timezone" class="btn btn-outline-danger" type="button" @click="timezone = null">
                <Icon v="times"/>
            </button>
        </div>
        <div v-if="timezone">
            <div class="form-check form-switch my-2">
                <label>
                    <input class="form-check-input" type="checkbox" v-model="publishArea">
                    <T>profile.timezone.publishArea</T><T>quotation.colon</T>
                    <br class="d-md-none"/>
                    <strong>
                        <Icon :v="getTimezoneInfo(timezone).icon"/>
                        <T>profile.timezone.areas.{{ getTimezoneInfo(timezone).area }}</T>
                    </strong>
                </label>
            </div>

            <div class="form-check form-switch my-2">
                <label>
                    <input class="form-check-input" type="checkbox" v-model="publishLocation">
                    <T>profile.timezone.publishLocation</T><T>quotation.colon</T>
                    <br class="d-md-none"/>
                    <strong>
                        <Icon v="map-marked-alt"/>
                        {{ getTimezoneInfo(timezone).location }}
                    </strong>
                </label>
            </div>
        </div>
    </div>
</template>

<script>
import timezone from "../plugins/timezone";

export default {
    mixins: [ timezone ],
    props: {
        value: {},
    },
    data() {
        return {
            timezones: [],
            timezone: this.value?.tz,
            publishArea: !!this.value?.area,
            publishLocation: !!this.value?.loc,
        }
    },
    mounted() {
        if (!process.client) { return; }

        this.timezones = Intl.supportedValuesOf('timeZone');
    },
    methods: {
        detect() {
            this.timezone = this.detectBrowserTimezone();
        },
        update() {
            this.$emit('input', this.timezone ? {
                tz: this.timezone,
                area: this.publishArea,
                loc: this.publishLocation,
            } : null);
        }
    },
    watch: {
        timezone() {
            this.update();
        },
        publishArea() {
            this.update();
        },
        publishLocation() {
            this.update();
        },
    },
}
</script>

<style lang="scss" scoped>
.select {
    position: relative;
    .list-group {
        position: absolute;
        top: 100%;
        max-height: 300px;
        overflow-y: auto;
        z-index: 999;
    }
}
</style>
