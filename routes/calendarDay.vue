<template>
    <div v-if="year.eventsByDate[day.toString()]">
        <CommunityNav/>

        <h2>
            <Icon v="calendar-star"/>
            <T>calendar.headerLong</T> <small class="text-muted">({{day}})</small>
        </h2>

        <section>
            <div class="d-flex justify-content-evenly flex-column-reverse flex-md-row align-items-center align-items-md-start">
                <div class="calendar-month my-3">
                    <h3 class="text-center"><T>calendar.months.{{day.month}}</T></h3>
                    <Calendar :year="year" :month="day.month" :mark="day"/>
                </div>
                <div class="calendar-events my-3">
                    <h3><T :params="{day: day.day}">calendar.dates.{{day.month}}</T> {{day.year}}</h3>
                    <ul class="list-unstyled mb-0">
                        <CalendarEvent v-for="event in year.eventsByDate[day.toString()]" :event="event" :key="event.name"/>
                    </ul>
                </div>
            </div>
        </section>

        <CalendarExtra :day="day"/>

        <Support/>

        <section>
            <Share :title="$t('calendar.header')"/>
        </section>
    </div>
    <NotFound v-else/>
</template>

<script>
    import { head } from "../src/helpers";
    import { calendar } from '../src/calendar/calendar';
    import { Day } from '../src/calendar/helpers';

    export default {
        data() {
            const day = new Day(
                this.$route.params.year,
                this.$route.params.month,
                this.$route.params.day,
            );

            return {
                day,
                year: calendar.getYear(day.year),
            }
        },
        head() {
            return head({
                title: this.$t('calendar.headerLong'),
                banner: `calendar/overview.png`,
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
