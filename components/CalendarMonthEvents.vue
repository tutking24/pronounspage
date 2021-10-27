<template>
    <ul class="list-unstyled mb-0">
        <li v-for="event in events" class="mb-2">
            <CalendarEvent :event="event" :year="year.year" range :key="event.name"/>
        </li>
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
