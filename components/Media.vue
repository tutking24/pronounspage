<template>
    <section v-if="config.links.media.length">
        <h2 class="h3">
            <Icon v="tv"/>
            <T>links.media</T>
        </h2>
        <ul class="list-unstyled">
            <Link v-for="link in config.links.media" :link="link" :key="link.url"/>
        </ul>
    </section>
</template>
