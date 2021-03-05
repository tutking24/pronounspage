<template>
    <section v-if="config.links.links.length">
        <h2 class="mb-3">
            <Icon v="bookmark"/>
            <T>links.headerLong</T>
        </h2>
        <ul class="list-unstyled">
            <Link v-for="link in config.links.links" :link="link" :key="link.url"/>
        </ul>
    </section>
</template>
