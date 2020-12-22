<template>
    <section v-if="Object.keys(locales).length >= 3">
        <h2 class="mb-3">
            <Icon v="language"/>
            <T>links.languageVersions</T>
        </h2>
        <ul class="list-unstyled">
            <li v-for="(options, locale) in locales" :key="locale" v-if="locale !== config.locale">
                <a :href="options.url">
                    <Icon v="long-arrow-right"/>
                    {{options.name}}
                </a>
            </li>
            <li>
                <LocaleLink locale="en" link="/blog/creating-new-language-version" class="small">
                    <Icon v="plus"/>
                    <T>localise.shorter</T>
                </LocaleLink>
            </li>
        </ul>
    </section>
</template>
