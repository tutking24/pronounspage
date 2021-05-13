<template>
    <section v-if="config.links.links.length">
        <h2 class="mb-3">
            <Icon v="vial"/>
            <T>links.academic</T>
        </h2>
        <ul class="list-unstyled">
            <Link v-for="link in config.links.academic" :link="link" :key="link.url"/>
        </ul>
    </section>
</template>
