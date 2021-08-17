<template>
    <section v-if="config.calendar && config.calendar.enabled && events !== undefined" class="alert alert-info">
        <p class="h3">
            <Icon v="calendar-star"/>
            <T>calendar.banner</T>:
        </p>
        <ul class="list-unstyled my-3 ms-3">
            <li v-for="event in events" class="mb-2">
                <Flag v-if="event.flag" name="" alt="" :img="`/flags/${event.flag}.png`"/>
                <Icon v-else v="arrow-circle-right"/>
                <T v-if="$te(`calendar.events.${event.name}`)"></T>
                <LinkedText v-else :text="event.name"/>
            </li>
        </ul>
        <nuxt-link v-if="link" :to="`/${config.calendar.route}`" class="small">
            <Icon v="angle-right"/>
            <T>calendar.headerLong</T>
        </nuxt-link>
    </section>
</template>

<script>
    import { currentYear } from '../src/calendar/calendar';
    import { Day } from '../src/calendar/helpers';

    export default {
        props: {
            link: { type: Boolean },
        },
        data() {
            return {
                events: currentYear.eventsByDate[Day.today().toString()],
            }
        }
    }
</script>
