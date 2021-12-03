<template>
    <div v-if="year">
        <CommunityNav v-if="!basic"/>

        <h2 class="d-flex justify-content-between flex-column flex-md-row">
            <span>
                <Icon v="calendar-star"/>
                <T>calendar.headerLong</T> <small class="text-muted">({{year.year}})</small>
            </span>
            <span v-if="basic" class="h4 mt-2">
                <nuxt-link :to="`/${ config.calendar.route }`">
                    <Icon v="tags"/>
                    <T>domain</T>/{{ config.calendar.route }}
                </nuxt-link>
            </span>
            <span v-else class="btn-group">
                <button :class="['btn', labels ? 'btn-outline-primary' : 'btn-primary']" @click="labels = false">
                    <Icon v="table"/>
                    <T>calendar.view.grid</T>
                </button>
                <button :class="['btn', labels ? 'btn-primary' : 'btn-outline-primary']" @click="labels = true">
                    <Icon v="list"/>
                    <T>calendar.view.list</T>
                </button>
            </span>
        </h2>

        <CalendarBanner v-if="!basic && year.isCurrent()"/>

        <template v-if="basic">
            <section v-if="labels" class="columns-4 pb-4">
                <div v-for="i in 12" class="py-3">
                    <h3 class="text-center"><T>calendar.months.{{i}}</T></h3>
                    <CalendarMonthEvents :year="year" :month="i" class="small my-3"/>
                </div>
            </section>
            <section v-else class="row pb-4">
                <div v-for="i in 12" class="col-12 col-lg-3 py-3">
                    <h3 class="text-center"><T>calendar.months.{{i}}</T></h3>
                    <Calendar :year="year" :month="i"/>
                </div>
            </section>
        </template>
        <template v-else>
            <section v-if="labels" class="columns-3">
                <div v-for="i in 12" class="py-3">
                    <h3 class="text-center"><T>calendar.months.{{i}}</T></h3>
                    <CalendarMonthEvents :year="year" :month="i" class="small my-3"/>
                </div>
            </section>
            <section v-else class="row">
                <div v-for="i in 12" class="col-12 col-sm-6 col-lg-4 py-3">
                    <h3 class="text-center"><T>calendar.months.{{i}}</T></h3>
                    <Calendar :year="year" :month="i" :mark="today" tooltips/>
                </div>
            </section>
        </template>

        <template v-if="!basic">
            <CalendarExtra :year="year"/>

            <Support/>

            <section>
                <Share :title="$t('calendar.header')"/>
            </section>
        </template>
    </div>
    <NotFound v-else/>
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
            return {
                year: this.$route.params.year
                    ? calendar.getYear(this.$route.params.year)
                    : calendar.getCurrentYear(),
                today: Day.today(),
                basic: this.$route.query.layout === 'basic',
                labels: this.$route.query.labels === 'true',
            }
        },
        head() {
            if (!this.year) {
                return {};
            }
            return head({
                title: this.$t('calendar.headerLong'),
                banner: `calendar/${this.year.year}-overview.png`,
            });
        },
    };
</script>

<style lang="scss" scoped>
@import "assets/variables";

@for $i from 3 to 5 {
    @include media-breakpoint-up('lg', $grid-breakpoints) {
        .columns-#{$i} {
            column-count: $i;
            > * {
                break-inside: avoid-column;
            }
        }
    }
}
</style>
