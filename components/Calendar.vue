<template>
    <div class="calendar">
        <div v-for="i in (startingDayOfWeek - 1)"></div>
        <div v-for="d in iterateMonth(year, month)"
             :class="['rounded-circle', getDayClass(d), d.equals(today) ? 'day-today' : '', d.equals(selectedDay) ? 'day-selected' : '']"
             @click.stop="selectDay(d)"
             :data-flag="getDayFlag(d)"
             :style="getDayFlag(d) ? `background-image: url('${getDayFlag(d)}')` : ''"
        >
            <div class="day-number">{{ d.day }}</div>
            <div v-if="currentYear.eventsByDate[d.toString()] !== undefined && d.equals(selectedDay)" class="day-tooltip card text-dark shadow">
                <div class="card-header">
                    <strong><T :params="{day: d.day}">calendar.dates.{{d.month}}</T></strong>
                </div>
                <div class="card-body">
                    <ul class="list-unstyled mb-0">
                        <li v-for="event in currentYear.eventsByDate[d.toString()]">
                            <Flag v-if="event.flag" name="" alt="" :img="`/flags/${event.flag}.png`"/>
                            <Icon v-else v="arrow-circle-right"/>
                            <T>calendar.events.{{ event.name }}</T>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { Day, iterateMonth, currentYear } from '../src/calendar';

    export default {
        props: {
            year: { required: true },
            month: { required: true },
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

                if (this.currentYear.eventsByDate[d.toString()].some(e => e.length() === 1)) {
                    return 'day day-event day-event-single';
                }

                return 'day day-event day-event-multi';
            },
            getDayFlag(d) {
                for (let event of (this.currentYear.eventsByDate[d.toString()] || []).filter(e => e.length() === 1)) {
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
            aspect-ratio: 1;
            display: flex;
            align-items: center;
            justify-content: space-evenly;
            cursor: default;
            user-select: none;
            position: relative;
            &.day-event {
                cursor: pointer;
                border: 1px solid $primary;
                &.day-event-single {
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
                }
                z-index: 999;
                cursor: default;
            }
        }
    }
</style>
