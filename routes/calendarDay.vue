<template>
    <div v-if="year.eventsByDate[day.toString()] || basic" :class="basic ? 'py-5' : ''">
        <CommunityNav v-if="!basic"/>

        <h2 class="d-flex justify-content-between">
            <span>
                <Icon v="calendar-star"/>
                <T>calendar.headerLong</T> <small class="text-muted">({{day}})</small>
            </span>
            <span v-if="basic" class="h4 mt-2">
                <nuxt-link :to="`/${ config.calendar.route }`">
                    <Icon v="tags"/>
                    <T>domain</T>/{{ config.calendar.route }}
                </nuxt-link>
            </span>
        </h2>

        <section>
            <div class="d-flex justify-content-evenly flex-column-reverse flex-md-row align-items-center align-items-md-start">
                <div class="calendar-month my-3">
                    <h3 class="text-center"><T>calendar.months.{{day.month}}</T></h3>
                    <Calendar :year="year" :month="day.month" :mark="basic ? null : day"/>
                </div>
                <div class="calendar-events my-3">
                    <h3><T :params="{day: day.day}">calendar.dates.{{day.month}}</T> {{day.year}}</h3>
                    <ul class="list-unstyled mb-0">
                        <CalendarEvent v-for="event in year.eventsByDate[day.toString()]" :event="event" :key="event.name"/>
                    </ul>
                </div>
            </div>
        </section>

        <template v-if="!basic">
            <CalendarExtra :day="day"/>

            <Support/>

            <section>
                <Share :title="$t('calendar.header')"/>
            </section>
        </template>
    </div>
    <NotFound v-else/>
</template>

<script>
    import { head } from "../src/helpers";
    import { calendar } from '../src/calendar/calendar';
    import { Day } from '../src/calendar/helpers';

    export default {
        layout({route}) {
            return route.query.layout === 'basic' ? 'basic' : 'default';
        },
        data() {
            const day = new Day(
                this.$route.params.year,
                this.$route.params.month,
                this.$route.params.day,
            );

            return {
                day,
                year: calendar.getYear(day.year),
                basic: this.$route.query.layout === 'basic',
            }
        },
        head() {
            return head({
                title: this.$t('calendar.headerLong'),
                banner: `calendar/${this.day}.png`,
            });
        },
    };
</script>

<style lang="scss" scoped>
    .calendar-month {
        width: min(18rem, 100%);
    }
    .calendar-events {
        width: min(20rem, 100%);
    }
</style>
