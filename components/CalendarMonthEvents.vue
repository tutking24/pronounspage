<template>
    <ul class="list-unstyled mb-0">
        <CalendarEvent v-for="event in events" :event="event" :range="year"/>
    </ul>
</template>

<script>
    import { iterateMonth } from '../src/calendar/helpers';
    import { currentYear } from '../src/calendar/calendar';

    export default {
        props: {
            year: { required: true },
            month: { required: true },
        },
        computed: {
            events() {
                let events = [];
                for (let day of iterateMonth(this.year, this.month)) {
                    for (let event of currentYear.eventsByDate[day.toString()] || []) {
                        if (event.isFirstDay(day)) {
                            events.push(event);
                        }
                    }
                }
                return events;
            }
        }
    }
</script>
