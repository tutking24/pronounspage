<template>
    <div class="container">
        <Homepage/>
        <h1>
            <Icon v="books"/>
            Niebinarna polszczyzna w literaturze, prasie, filmach i serialach
        </h1>

        <LiteratureMenu all/>

        <section>
            <ul>
                <li v-for="template in templates" v-if="template.sources.length">
                    <a :href="'#' + (template.name ? template.name().replace(/\//g, '-') : 'inne')">
                        {{ template.description }}
                        <small v-if="template.name">({{ template.name() }})</small>
                    </a>
                </li>
                <li>
                    <a href="#inne">
                        Inne formy
                    </a>
                </li>
            </ul>
        </section>

        <section>
            <Share title="Niebinarna polszczyzna w literaturze, prasie, filmach i serialach"/>
        </section>

        <section v-for="template in templates" v-if="template.sources.length">
            <h2 class="h4" :id="template.name().replace(/\//g, '-')">
                <nuxt-link :to="'/' + template.pronoun()">
                    {{ template.description }}
                    <small>({{ template.name() }})</small>
                </nuxt-link>
            </h2>

            <ul class="list-unstyled">
                <li v-for="source in template.sources">
                    <Source :name="source"/>
                </li>
            </ul>
        </section>

        <section>
            <h2 class="h4" id="inne">
                Inne formy
            </h2>

            <ul class="list-unstyled">
                <li v-for="source in otherSources">
                    <Source :name="source"/>
                </li>
            </ul>
        </section>
    </div>
</template>

<script>
    import { templates, sources } from '../src/data'

    export default {
        data() {
            return {
                templates: templates,
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
        computed: {
            otherSources() {
                const other = new Set(Object.keys(sources));
                for (let template of Object.values(this.templates)) {
                    for (let source of template.sources) {
                        other.delete(source);
                    }
                }
                return other;
            },
        },
    }
</script>
