<template>
    <span>
        <span v-if="range" class="badge bg-primary">{{ event.getRange(year) }}</span>
        <Flag v-if="event.flag" :alt="$t('flags_alt.' + event.flag.replace(/'/g, '*').replace(/ /g, '_')) || ''" :img="`/flags/${event.flag}.png`"/>
        <Icon v-else v="arrow-circle-right"/>
        <T v-if="$te(`calendar.events.${eventName}`, true)" :params="{param: eventParam}">calendar.events.{{eventName}}</T>
        <LinkedText v-else :text="eventName"/>
        <a v-if="ics" :href="`/api/queer-calendar-${config.locale}-${year}-${event.getUuid()}.ics`" class="small" :aria-label="$t('crud.download') + ' .ics'" :title="$t('crud.download') + ' .ics'">
            <Icon v="calendar-plus"/>
        </a>
        <small v-if="event.localCalendar">({{event.localCalendar}})</small>
    </span>
</template>

<script>
    export default {
        props: {
            event: { required: true },
            year: { 'default': () => (new Date).getFullYear() },
            range: { type: Boolean },
            ics: { type: Boolean },
        },
        computed: {
            eventName() {
                return this.event.name.split('$')[0];
            },
            eventParam() {
                return this.event.name.split('$')[1] || null;
            },
        }
    }
</script>

