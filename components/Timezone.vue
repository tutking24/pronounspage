<template>
    <div v-if="timezone && dt">
        <p v-if="!static">
            <Icon v="clock"/>
            <T :params="{
                time: dt.toLocaleString(DateTime.TIME_SIMPLE),
                weekday: dt.toFormat('cccc')
            }">profile.timezone.time</T>
            <small class="text-muted">(UTC{{timezone.offset ? timezone.offsetFormatted : ''}})</small>
            <!--(<Tooltip :text="timezone.long">{{timezone.short}}</Tooltip>)-->
        </p>
        <p v-if="value.area || value.loc">
            <template v-if="value.area">
                <Icon :v="timezone.icon"/>
                <T>profile.timezone.areas.{{ timezone.area }}</T>
            </template>
            <span v-if="value.area && value.loc">/</span>
            <template v-if="value.loc">
                <Icon v="map-marked-alt"/>
                {{ timezone.location }}
                <br/><small class="text-muted"><T>profile.timezone.approximate</T></small>
            </template>
        </p>
    </div>
</template>

<script>
import timezone from "../plugins/timezone";
import {DateTime} from 'luxon';

export default {
    mixins: [ timezone ],
    props: {
        value: {},
        static: { type: Boolean },
    },
    data() {
        return {
            timezone: this.value ? this.getTimezoneInfo(this.value.tz) : null,
            DateTime,
            dt: undefined,
        }
    },
    methods: {
        update() {
            this.dt = DateTime.local().setZone(this.value.tz);
            this.$forceUpdate();
        }
    },
    mounted() {
        if (!this.value) { return; }

        this.update();
        setInterval(this.update, 500);
    },
}
</script>
