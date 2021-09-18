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
            <div class="alert alert-info row">
                <div class="col-12 col-lg-6">
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
                <div class="col-12 col-lg-6">
                    <p class="mb-0">
                        <T>calendar.image.header</T>:
                    </p>
                    <p class="mb-0">
                        <a href="/calendar/overview.png" target="_blank" rel="noopener" class="btn btn-outline-primary m-1">
                            <Icon v="image"/>
                            <T>calendar.image.overview</T>
                        </a>
                        <a href="/calendar/labels.png" target="_blank" rel="noopener" class="btn btn-outline-primary m-1">
                            <Icon v="image"/>
                            <T>calendar.image.labels</T>
                        </a>
                    </p>
                </div>
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
                banner: `calendar/overview.png`,
            });
        },
    };
</script>
