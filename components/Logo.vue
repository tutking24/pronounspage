<template>
    <span v-if="flag"
          :class="['logo-wrapper rounded-circle d-inline-flex justify-content-center align-items-center', forceShowFlag || forceShowFlagDyn ? 'logo-flag-forced' : '', flagName ? 'logo-has-flag' : '']"
          :style="flagName ? `--flag: url('/flags/${flagName}.png')` : ''">
        <span class="logo" v-html="svg"/>
    </span>
    <span v-else class="logo" v-html="svg"/>
</template>

<script>
import {Day} from "@/src/calendar/helpers";
import { calendar } from '../src/calendar/calendar';
import { ImmutableArray } from '../src/helpers';

export default {
    props: {
        flag: { type: Boolean },
        forceShowFlag: { type: Boolean },
        day: { 'default': () => Day.today() },
    },
    data() {
        return {
            svg: process.env.LOGO,
            flagName: this.selectFlag(),
            d: this.day,
            forceShowFlagDyn: false,
        };
    },
    mounted() {
        this.$eventHub.$on('calendar-select', (d) => {
            this.forceShowFlagDyn = !!d;
            this.d = d;
            this.flagName = this.selectFlag();
        })
    },
    methods: {
        selectFlag() {
            const events = calendar.getCurrentYear().eventsByDate[(this.d || this.day).toString()];
            if (!events) { return null; }
            return new ImmutableArray(...events)
                .filter(e => e.flag && !e.flag.startsWith('_'))
                .sorted((a, b) => b.level - a.level)
                .groupBy(e => e.level)
                .indexOrFallback(0, [0, new ImmutableArray()])[1]
                .map(e => e.flag)
                .randomElement();
        }
    }
}
</script>

<style lang="scss">
    .logo-wrapper {
        width: 1.3em;
        height: 1.3em;
        position: relative;
        overflow: hidden;
        &:before {
            content: ' ';
            display: block;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-image: var(--flag);
            background-position: center;
            background-size: cover;
            background-repeat: no-repeat;
            z-index: -5;

            opacity: 0;
            transition: all .25s ease-in-out;
        }
    }

    .logo {
        height: 1em;
        width: 1em;
        display: inline-block;
        vertical-align: middle;
        svg {
            vertical-align: baseline !important;
        }
    }

    .logo-wrapper.logo-flag-forced.logo-has-flag, h1:hover .logo-wrapper.logo-has-flag {
        svg path {
            stroke: white;
            stroke-width: 10;
        }
        &:before {
            opacity: 1;
        }
    }
</style>
