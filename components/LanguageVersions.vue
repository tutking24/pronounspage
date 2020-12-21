<template>
    <section v-if="Object.keys(locales).length >= 3">
        <h2 class="mb-3">
            <Icon v="language"/>
            <T>links.languageVersions</T>
        </h2>
        <ul class="list-unstyled">
            <li v-for="(options, locale) in locales" :key="locale" v-if="locale !== config.locale">
                <Icon v="long-arrow-right"/>
                <a :href="options.url">
                    {{options.name}}
                </a>
            </li>
        </ul>
    </section>
</template>
