<template>
    <section>
        <div class="alert alert-info d-flex flex-column flex-md-row justify-content-around">
            <div v-if="day">
                <p class="mb-0">
                    <T>calendar.full</T>:
                </p>
                <nuxt-link :to="`/${config.calendar.route}/${day.year}`" class="btn btn-primary m-1">
                    <Icon v="calendar-star"/>
                    {{ day.year }}
                </nuxt-link>
            </div>
            <div>
                <p class="mb-0">
                    Twitter Bot:
                </p>
                <p class="mb-0">
                    <a href="https://twitter.com/CalendarQueer" target="_blank" rel="noopener" class="btn btn-outline-primary m-1">
                        <Icon v="twitter" set="b"/>
                        @CalendarQueer
                    </a>
                </p>
            </div>
            <div v-if="!day">
                <p class="mb-0">
                    iCalendar:
                </p>
                <a :href="`/api/calendar/queer-calendar-${year.year}.ics`" class="btn btn-outline-primary m-1">
                    <Icon v="calendar-plus"/>
                    ICS
                </a>
            </div>
            <div>
                <p class="mb-0">
                    <T>calendar.image.header</T>:
                </p>
                <p class="mb-0" v-if="day">
                    <a :href="`/calendar/${day}.png`" target="_blank" rel="noopener" class="btn btn-outline-primary m-1">
                        <Icon v="image"/>
                        <T>calendar.image.overview</T>
                    </a>
                </p>
                <p class="mb-0" v-else>
                    <a :href="`/calendar/${year.year}-overview.png`" target="_blank" rel="noopener" class="btn btn-outline-primary m-1">
                        <Icon v="image"/>
                        <T>calendar.image.overview</T>
                    </a>
                    <a :href="`/calendar/${year.year}-labels.png`" target="_blank" rel="noopener" class="btn btn-outline-primary m-1">
                        <Icon v="image"/>
                        <T>calendar.image.labels</T>
                    </a>
                </p>
            </div>
        </div>
    </section>
</template>

<script>
    export default {
        props: {
            day: {},
            year: {},
        }
    }
</script>
