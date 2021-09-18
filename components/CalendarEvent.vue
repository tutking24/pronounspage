<template>
    <li class="mb-2">
        <span v-if="range" class="badge bg-primary">{{ event.getRange(range) }}</span>
        <Flag v-if="event.flag" name="" alt="" :img="`/flags/${event.flag}.png`"/>
        <Icon v-else v="arrow-circle-right"/>
        <T v-if="$te(`calendar.events.${event.name}`)">calendar.events.{{event.name}}</T>
        <LinkedText v-else :text="event.name"/>
    </li>
</template>

<script>
    export default {
        props: {
            event: { required: true },
            range: {},
        },
    }
</script>

