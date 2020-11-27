<template>
    <section v-if="config.links.recommended.length">
        <h2 class="mb-3">
            <Icon v="thumbs-up"/>
            <T>links.recommended</T>
        </h2>
        <ul class="list-unstyled">
            <Link v-for="link in config.links.recommended" :link="link" :key="link.url"/>
        </ul>
    </section>
</template>
