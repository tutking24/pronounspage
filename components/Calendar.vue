<template>
    <div class="calendar">
        <div v-for="i in (startingDayOfWeek - 1)"></div>
        <div v-for="d in iterateMonth(year, month)"
             :class="['rounded-circle', getDayClass(d), markToday && d.equals(today) ? 'day-today' : '', d.equals(selectedDay) ? 'day-selected' : '']"
             @click.stop="selectDay(d)"
             :data-flag="getDayFlag(d)"
             :style="getDayFlag(d) ? `background-image: url('${getDayFlag(d)}')` : ''"
        >
            <div class="day-number">{{ d.day }}</div>
            <div v-if="currentYear.eventsByDate[d.toString()] !== undefined && d.equals(selectedDay)" class="day-tooltip card text-dark shadow">
                <div class="card-header d-flex justify-content-between">
                    <p class="h5 mb-0"><strong><T :params="{day: d.day}">calendar.dates.{{d.month}}</T></strong></p>
                    <button class="btn btn-sm py-0" @clik="selectedDay = null"><Icon v="times"/></button>
                </div>
                <div class="card-body">
                    <ul class="list-unstyled mb-0">
                        <CalendarEvent v-for="event in currentYear.eventsByDate[d.toString()]" :event="event"/>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { Day, iterateMonth, EventLevel } from '../src/calendar/helpers';
    import { currentYear } from '../src/calendar/calendar';

    export default {
        props: {
            year: { required: true },
            month: { required: true },
            markToday: { type: Boolean },
        },
        data() {
            return {
                iterateMonth,
                currentYear,
                today: Day.today(),
                selectedDay: null,
            }
        },
        mounted() {
            this.$eventHub.$on('calendar-select', selectedDay => {
                if (this.selectedDay && !this.selectedDay.equals(selectedDay)) {
                    this.selectedDay = null;
                }
            });
        },
        created() {
            if (process.client) {
                document.addEventListener('click', this.documentClicked);
            }
        },
        destroyed() {
            if (process.client) {
                document.removeEventListener('click', this.documentClicked);
            }
        },
        computed: {
            startingDayOfWeek() {
                return new Day(this.year, this.month, 1).dayOfWeek;
            }
        },
        methods: {
            getDayClass(d) {
                if (this.currentYear.eventsByDate[d.toString()] === undefined) {
                    return 'day';
                }

                let maxLevel = 0;
                for (let event of this.currentYear.eventsByDate[d.toString()]) {
                    if (event.level > maxLevel) {
                        maxLevel = event.level;
                    }
                }

                return `day day-event day-event-${maxLevel}`;
            },
            getDayFlag(d) {
                for (let event of (this.currentYear.eventsByDate[d.toString()] || []).filter(e => e.level === EventLevel.MajorDay && e.flag)) {
                    return `/flags/${event.flag}.png`;
                }
                return null;
            },
            documentClicked() {
                if (this.selectedDay) {
                    this.selectedDay = null;
                }
            },
            selectDay(d) {
                if (d.equals(this.selectedDay)) {
                    this.selectedDay = null;
                } else {
                    this.selectedDay = d;
                }
                this.$eventHub.$emit('calendar-select', this.selectedDay);
            },
        },
    }
</script>

<style lang="scss" scoped>
    @import "assets/style";

    .calendar {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        grid-column-gap: 2px;
        grid-row-gap: 2px;
        > .day {
            /*aspect-ratio: 1;*/
            &::before {
                float: left;
                padding-top: 100%;
                content: '';
            }
            &::after {
                display: block;
                content: '';
                clear: both;
            }

            display: flex;
            align-items: center;
            justify-content: space-evenly;
            cursor: default;
            user-select: none;
            position: relative;
            &.day-event {
                cursor: pointer;
                &.day-event-0 {
                    background-color: lighten($primary, 50%);
                }
                &.day-event-1 {
                    background-color: lighten($primary, 40%);
                }
                &.day-event-2 {
                    background-color: lighten($primary, 50%);
                    border: 1px solid lighten($primary, 25%);
                }
                &.day-event-3 {
                    border: 1px solid lighten($primary, 25%);
                    background-color: $primary;
                    color: $white;
                    .day-number {
                        font-weight: bold;
                    }
                    &[data-flag] {
                        background-repeat: no-repeat;
                        background-position: center;
                        background-size: cover;
                        .day-number {
                            text-shadow: black 1px 1px 3px
                        }
                    }
                }
                &:hover, &.day-selected {
                    background: lighten($primary, 25%) !important;
                    @extend .shadow;
                    .day-number {
                        color: $white;
                    }
                }
            }
            &.day-today {
                border: 3px solid $black;
                @extend .shadow;
            }
            .day-tooltip {
                position: absolute;
                bottom: 0;
                left: 100%;
                width: 300px;
                @include media-breakpoint-down('md', $grid-breakpoints) {
                    position: fixed;
                    left: 0;
                    width: 100%;
                    padding-bottom: 3rem;
                }
                z-index: 1040;
                cursor: default;
            }
        }
    }
</style>
