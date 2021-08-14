<template>
    <div>
        <LinksNav/>

        <h2>
            <Icon v="calendar-star"/>
            <T>calendar.headerLong</T> ({{year}})
        </h2>

        <CalendarBanner/>

        <section class="row">
            <div v-for="i in 12" class="col-12 col-sm-6 col-lg-4 py-3">
                <h3 class="text-center"><T>calendar.months.{{i}}</T></h3>
                <Calendar :year="year" :month="i"/>
            </div>
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
            }
        },
        head() {
            return head({
                title: this.$t('calendar.headerLong'),
            });
        },
    };
</script>
