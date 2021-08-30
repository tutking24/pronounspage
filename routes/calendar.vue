<template>
    <div>
        <CommunityNav/>

        <h2>
            <Icon v="calendar-star"/>
            <T>calendar.headerLong</T> ({{year}})
        </h2>

        <CalendarBanner/>

        <section class="row">
            <div v-for="i in 12" class="col-12 col-sm-6 col-lg-4 py-3">
                <h3 class="text-center"><T>calendar.months.{{i}}</T></h3>
                <Calendar :year="year" :month="i" markToday/>
            </div>
        </section>

        <section>
            <T>calendar.image.header</T>
            <a :href="`/${imageOverview}`" target="_blank" rel="noopener" class="btn btn-outline-primary btn-sm">
                <Icon v="image"/>
                <T>calendar.image.overview</T>
            </a>
            <a :href="`/${imageLabels}`" target="_blank" rel="noopener" class="btn btn-outline-primary btn-sm">
                <Icon v="image"/>
                <T>calendar.image.labels</T>
            </a>
        </section>

        <Support/>

        <section>
            <Share :title="$t('calendar.header')"/>
        </section>
    </div>
</template>

<script>
    import { head } from "../src/helpers";

    export default {
        data() {
            return {
                year: new Date().getFullYear(),
                imageOverview: `calendar/calendar-${process.env.LOCALE}-overview.png`,
                imageLabels: `calendar/calendar-${process.env.LOCALE}-labels.png`,
            }
        },
        head() {
            return head({
                title: this.$t('calendar.headerLong'),
                banner: this.imageOverview,
            });
        },
    };
</script>
