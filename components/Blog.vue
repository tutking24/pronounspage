<template>
    <section v-if="Object.keys(config.links.blog).length">
        <h2>
            <Icon v="pen-nib"/>
            <T>links.blog</T>
        </h2>
        <ul>
            <li v-for="(title, slug) in config.links.blog" class="mb-2">
                <nuxt-link :to="`/blog/${slug}`">
                    {{title}}
                </nuxt-link>
            </li>
        </ul>
    </section>
</template>
