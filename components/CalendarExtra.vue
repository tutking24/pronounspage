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
                <button :class="['btn', clipboardFeedback ? 'btn-success' : 'btn-outline-primary', 'm-1']" ref="clipboard" :data-clipboard-text="icsLink">
                    <Icon :v="clipboardFeedback ? 'clipboard-check' : 'clipboard'"/>
                    <T>crud.copy</T>
                </button>
                <a :href="icsLink" class="btn btn-outline-primary m-1">
                    <Icon v="calendar-plus"/>
                    <T>crud.download</T>
                    .ics
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
    import ClipboardJS from 'clipboard';

    export default {
        props: {
            day: {},
            year: {},
        },
        data() {
            return {
                clipboardFeedback: false,
            }
        },
        mounted() {
            const clipboard = new ClipboardJS(this.$refs.clipboard);
            clipboard.on('success', (e) => {
                this.clipboardFeedback = true;
                setTimeout(() => this.clipboardFeedback = false, 3000);
            });
        },
        computed: {
            icsLink() {
                return `${process.env.BASE_URL}/api/queer-calendar-${this.config.locale}${this.year.year === (new Date).getFullYear() ? '' : '-' + this.year.year}.ics`;
            },
        },
    }
</script>
