<template>
    <ul class="list-unstyled mb-0">
        <CalendarEvent v-for="event in events" :event="event" :range="year.year" :key="event.name"/>
    </ul>
</template>

<script>
    import { iterateMonth } from '../src/calendar/helpers';

    export default {
        props: {
            year: { required: true },
            month: { required: true },
        },
        computed: {
            events() {
                let events = [];
                for (let day of iterateMonth(this.year.year, this.month)) {
                    for (let event of this.year.eventsByDate[day.toString()] || []) {
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
