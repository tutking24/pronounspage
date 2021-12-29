<template>
    <span>
        {{$t('calendar.date', {year: day.year, date: $t('calendar.dates.' + day.month, {day: day.day})})}}
        <DateLocal :day="day" :inline="inline"/>
    </span>
</template>

<script>
import DateLocal from '../data/calendar/DateLocal.vue';

export default {
    components: { DateLocal },
    props: {
        day: { required: true },
        inline: { type: Boolean },
    },
};
</script>
