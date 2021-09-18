<template>
    <section v-if="config.links.socials.length">
        <h2 class="mb-3">
            <Icon v="hashtag"/>
            <T>links.social</T>
        </h2>
        <ul class="list-unstyled">
            <Link v-for="link in config.links.socials" :link="link" :key="link.url"/>
        </ul>
    </section>
</template>
