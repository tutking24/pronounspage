<template>
    <div v-if="year">
        <CommunityNav/>

        <h2>
            <Icon v="calendar-star"/>
            <T>calendar.headerLong</T> <small class="text-muted">({{year.year}})</small>
        </h2>

        <CalendarBanner v-if="year.isCurrent()"/>

        <section class="row">
            <div v-for="i in 12" class="col-12 col-sm-6 col-lg-4 py-3">
                <h3 class="text-center"><T>calendar.months.{{i}}</T></h3>
                <Calendar :year="year" :month="i" :mark="today" tooltips/>
            </div>
        </section>

        <CalendarExtra/>

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
            return {
                year: this.$route.params.year
                    ? calendar.getYear(this.$route.params.year)
                    : calendar.getCurrentYear(),
                today: Day.today(),
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
