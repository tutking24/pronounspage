<template>
    <section v-if="socials.length">
        <h2 class="mb-3">
            <Icon v="hashtag"/>
            <T>links.social</T>
        </h2>
        <ul class="list-unstyled">
            <Link v-for="link in socials" :link="link" :key="link.url"/>
        </ul>
    </section>
</template>

<script>
import {getSocialLinks} from '../src/contact';

export default {
    data() {
        return {
            socials: [...getSocialLinks(this.config)],
        };
    },
}
</script>
