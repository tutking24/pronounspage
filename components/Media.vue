<template>
    <section v-if="config.links.mediaGuests.length || config.links.mediaMentions.length">
        <h2>
            <Icon v="tv"/>
            <T>links.media</T>
        </h2>
        <h3 v-if="config.links.mediaGuests.length && config.links.mediaMentions.length" class="mt-4 mb-2">
            <Icon v="microphone-alt"/>
            <T>links.mediaGuests</T>
        </h3>
        <ul class="list-unstyled" v-if="config.links.mediaGuests.length">
            <Link v-for="link in config.links.mediaGuests" :link="link" :key="link.url"/>
        </ul>
        <h3 v-if="config.links.mediaGuests.length && config.links.mediaMentions.length" class="mt-4 mb-2">
            <Icon v="quote-right"/>
            <T>links.mediaMentions</T>
        </h3>
        <ul class="list-unstyled" v-if="config.links.mediaMentions.length">
            <Link v-for="link in config.links.mediaMentions" :link="link" :key="link.url"/>
        </ul>
    </section>
</template>
