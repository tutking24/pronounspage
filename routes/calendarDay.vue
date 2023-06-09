<template>
    <component :is="basic ? 'div' : 'Page'">
    <div v-if="year.eventsByDate[day.toString()] || basic" :class="basic ? 'py-5' : ''">
        <CommunityNav v-if="!basic"/>

        <h2 class="d-flex justify-content-between">
            <span>
                <Icon v="calendar-star"/>
                <nuxt-link :to="`/${config.calendar.route}`"><T>calendar.headerLong</T></nuxt-link>
                <small class="text-muted">({{day}})</small>
            </span>
            <span v-if="basic" class="h4 mt-2">
                <nuxt-link :to="`/${ config.calendar.route }`">
                    <Logo/>
                    <T>domain</T>/{{ config.calendar.route }}
                </nuxt-link>
            </span>
        </h2>

        <AdPlaceholder v-if="!basic" phkey="main-0"/>

        <section>
            <div class="d-flex justify-content-evenly flex-column-reverse flex-md-row align-items-center align-items-md-start">
                <div class="calendar-month my-3">
                    <h3 class="text-center"><T>calendar.months.{{day.month}}</T></h3>
                    <Calendar :year="year" :month="day.month" :mark="day"/>
                </div>
                <div class="calendar-events my-3">
                    <h3>
                        <DateWords :day="day"/>
                    </h3>
                    <ul class="list-unstyled mb-0">
                        <li v-for="event in year.eventsByDate[day.toString()]" class="mb-2">
                            <CalendarEvent :event="event" :year="year.year" :key="event.name" ics/>
                        </li>
                    </ul>
                </div>
            </div>
        </section>

        <template v-if="!basic">
            <AdPlaceholder phkey="main-1"/>
            <CalendarExtra :day="day"/>

            <Separator icon="heart"/>
            <Support/>

            <section>
                <Share :title="$t('calendar.header')"/>
            </section>
        </template>
    </div>
    <NotFound v-else/>
    </component>
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
