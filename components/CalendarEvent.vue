<template>
    <li class="mb-2">
        <span v-if="range" class="badge bg-primary">{{ event.getRange(range) }}</span>
        <Flag v-if="event.flag" name="" alt="" :img="`/flags/${event.flag}.png`"/>
        <Icon v-else v="arrow-circle-right"/>
        <T v-if="$te(`calendar.events.${eventName}`)" :params="{param: eventParam}">calendar.events.{{eventName}}</T>
        <LinkedText v-else :text="eventName"/>
    </li>
</template>

<script>
    export default {
        props: {
            event: { required: true },
            range: {},
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

