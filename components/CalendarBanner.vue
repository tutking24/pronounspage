<template>
    <section v-if="config.calendar && config.calendar.enabled && events !== undefined" class="alert alert-info">
        <p class="h3">
            <Icon v="calendar-star"/>
            <T>calendar.banner</T>:
        </p>
        <ul class="list-unstyled my-3 ms-3">
            <CalendarEvent v-for="event in events" :event="event" :key="event.name"/>
        </ul>
        <nuxt-link v-if="link" :to="`/${config.calendar.route}`" class="small">
            <Icon v="angle-right"/>
            <T>calendar.headerLong</T>
        </nuxt-link>
    </section>
</template>

<script>
    import { calendar } from '../src/calendar/calendar';
    import { Day } from '../src/calendar/helpers';

    export default {
        props: {
            day: { 'default': () => Day.today() },
            link: { type: Boolean },
        },
        data() {
            return {
                events: calendar.getCurrentYear().eventsByDate[this.day.toString()],
            }
        }
    }
</script>
