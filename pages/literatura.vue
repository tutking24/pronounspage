<template>
    <div class="container">
        <Homepage/>
        <h1>
            <Icon v="books"/>
            Niebinarna polszczyzna w literaturze, prasie, filmach i serialach
        </h1>

        <LiteratureMenu all/>

        <div v-for="template in templates">
            <template v-if="template.sources.length">
                <h2 v-if="template.name" class="h4">
                    <nuxt-link :to="'/' + template.pronoun()">
                        {{ template.description }}
                        <small>({{ template.name() }})</small>
                    </nuxt-link>
                </h2>
                <h2 v-else class="h4">
                    {{ template.description }}
                </h2>

                <ul class="list-unstyled">
                    <li v-for="source in template.sources">
                        <Source :source="source"/>
                    </li>
                </ul>
            </template>
        </div>
    </div>
</template>

<script>
    import { templates, otherSources } from '../src/data'

    export default {
        data() {
            return {
                templates: [...Object.values(templates), {description: 'Inne formy', sources: otherSources}],
            };
        },
        head() {
            const title = 'Niebinarna polszczyzna w literaturze';
            return {
                title: title,
                meta: [
                    { hid: 'og:title', property: 'og:title', content: title },
                    { hid: 'twitter:title', property: 'twitter:title', content: title },
                ],
            }
        },
    }
</script>
