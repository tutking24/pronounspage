<template>
    <div>
        <p v-for="(p, i) in term.definition.split('\n\n')">
            <template v-if="i === 0">
                <span v-if="term.key && $isGranted('terms')" class="badge bg-primary text-white">
                    <T>sources.submit.key</T>:
                    {{term.key}}
                </span>
                <strong><LinkedTextMultiple :texts="term.term" noicons/></strong>
                <span v-if="term.original.length">(<LinkedTextMultiple :texts="term.original" glue="; " noicons/>)</span>
                –
            </template>
            <LinkedText :text="p" noicons/>
        </p>

        <ul class="list-inline">
            <li v-for="category in term.categories" class="list-inline-item">
                <a v-if="categoryLink" :href="`#:${category}`" class="badge bg-primary text-white" @click.prevent="filter = ':' + category">
                    {{category}}
                </a>
                <span v-else="" class="badge bg-primary text-white">
                    {{category}}
                </span>
            </li>
        </ul>

        <p v-if="flags && (term.flags.length || term.images.length)" class="text-center">
            <img v-for="flag in term.flags" :src="`/flags/${flag}.png`" class="flag m-1"/>
            <img v-for="image in term.images" :src="buildImageUrl(image, 'big')" class="flag m-1"/>
        </p>

        <div v-if="config.calendar.enabled && events && events.length" class="alert">
            <p class="mb-2">
                <Icon v="calendar-star"/>
                <nuxt-link :to="`/${config.calendar.route}`"><T>calendar.headerLong</T></nuxt-link>:
            </p>
            <ul class="list-unstyled">
                <li v-for="event in events" class="mb-2 ms-3">
                    <CalendarEvent :event="event"/>
                    <span v-if="$te(`calendar.events.${event.name}___timeDescription`)">
                        <T>calendar.celebrating_custom</T>
                        <T>calendar.events.{{event.name}}___timeDescription</T>
                    </span>
                    <span v-else-if="event.level === EventLevel.Day">
                        <T>calendar.celebrating_day</T>
                        <T :params="{day: event.getRange()}">calendar.dates.{{ event.month }}</T>
                    </span>
                    <span v-else-if="event.level === EventLevel.Week">
                        <T>calendar.celebrating_week</T>
                        <T :params="{day: event.getRange()}">calendar.dates.{{ event.month }}</T>
                    </span>
                    <span v-else-if="event.level === EventLevel.Month">
                        <T>calendar.celebrating_month</T>
                        <T v-if="$te('calendar.months_abl')">calendar.months_abl.{{ event.month }}</T>
                        <T v-else>calendar.months.{{ event.month }}</T>
                    </span>
                </li>
            </ul>
        </div>

        <div v-if="versions && term.versions.length" class="my-3 mx-2">
            <p>
                <button :class="['btn', versionsShown ? 'btn-primary' : 'btn-outline-primary', 'btn-sm']" @click="versionsShown = !versionsShown">
                    <Icon v="language"/>
                    <T>sources.otherVersions</T>
                    <Icon :v="versionsShown ? 'caret-up' : 'caret-down'"/>
                </button>
            </p>
            <ul v-if="versionsShown">
                <li v-for="version in term.versions" v-if="locales[version.locale] !== undefined">
                    <h4 class="h6 mb-2">
                        <strong>
                            <a :href="`${locales[version.locale].url}`" target="_blank" rel="noopener">{{locales[version.locale].name}}</a>:
                        </strong>
                    </h4>
                    <Term :term="version"/>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import { EventLevel } from '../src/calendar/helpers';

    export default {
        props: {
            term: { required: true },
            categoryLink: { type: Boolean },
            flags: { type: Boolean },
            versions: { type: Boolean },
            events: { default: undefined },
        },
        data() {
            return {
                versionsShown: false,
                EventLevel,
            }
        }
    }
</script>
