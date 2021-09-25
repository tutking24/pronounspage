<template>
    <ul v-if="config.links.names && config.links.names.length" class="list-unstyled">
        <Link v-for="link in config.links.names" :link="link" :key="link.url"/>
    </ul>
</template>
