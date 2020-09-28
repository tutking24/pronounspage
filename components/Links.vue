<template>
    <section :class="{'mt-0': top}" v-if="config.links.links.length">
        <h2 class="mb-3">
            <Icon v="bookmark"/>
            <T>links.headerLong</T>
        </h2>
        <ul class="list-unstyled">
            <Link v-for="link in config.links.links" :link="link"/>
        </ul>
    </section>
</template>

<script>
    export default {
        props: {
            top: { type: Boolean },
        }
    };
</script>
