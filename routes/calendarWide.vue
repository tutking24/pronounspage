<template>
    <div>
        <h2 class="d-flex justify-content-between">
            <span>
                <Icon v="calendar-star"/>
                <T>calendar.headerLong</T> ({{year}})
            </span>
            <span class="h4 mt-2">
                <nuxt-link to="/">
                    <Icon v="tags"/>
                    <T>domain</T>/{{ config.calendar.route }}
                </nuxt-link>
            </span>
        </h2>

        <section class="row pb-4">
            <div v-for="i in 12" class="col-12 col-lg-3 py-3">
                <h3 class="text-center"><T>calendar.months.{{i}}</T></h3>
                <CalendarMonthEvents v-if="labels" :year="year" :month="i" class="small my-3"/>
                <Calendar v-else :year="year" :month="i"/>
            </div>
        </section>
    </div>
</template>

<script>
    import { head } from "../src/helpers";

    export default {
        layout: 'basic',
        data() {
            return {
                year: new Date().getFullYear(),
                labels: this.$route.query.labels === 'true',
            }
        },
        head() {
            return head({
                title: this.$t('calendar.headerLong'),
            });
        },
    }
</script>
