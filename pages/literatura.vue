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
                    <a :href="'#' + toId(template.name())">
                        {{ template.description }}
                        <small v-if="template.name">({{ template.name() }})</small>
                    </a>
                </li>
                <li v-for="(sources, multiple) in sourcesForMultipleForms">
                    <a :href="'#' + toId(multiple)">
                        Formy wymienne
                        <small>({{ multiple.replace(/&/g, ' lub ') }})</small>
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

        <section>
            <span class="mr-2 mb-3">
                <Icon v="filter"/>
                Filtruj:
            </span>
            <div class="btn-group">
                <button v-for="(config, type) in sourceTypes"
                        :class="['btn', type === filter ? 'btn-primary' : 'btn-outline-primary']"
                        @click="filter = type"
                >
                    <Icon :v="config.icon"/>
                    {{ config.text }}
                </button>
            </div>
        </section>

        <section v-for="template in templates" v-if="template.sources.length">
            <h2 class="h4" :id="toId(template.name())">
                <nuxt-link :to="'/' + template.pronoun()">
                    {{ template.description }}
                    <small>({{ template.name() }})</small>
                </nuxt-link>
            </h2>

            <ul class="list-unstyled">
                <li v-for="source in template.sources">
                    <Source :name="source" :filter="filter"/>
                </li>
            </ul>
        </section>

        <section v-for="(sources, multiple) in sourcesForMultipleForms">
            <h2 class="h4" :id="toId(multiple)">
                <nuxt-link :to="'/' + multiple">
                    Formy wymienne
                    <small>({{ multiple.replace(/&/g, ' lub ') }})</small>
                </nuxt-link>
            </h2>

            <ul class="list-unstyled">
                <li v-for="source in sources">
                    <Source :name="source" :filter="filter"/>
                </li>
            </ul>
        </section>

        <section>
            <h2 class="h4" id="inne">
                Inne formy
            </h2>

            <ul class="list-unstyled">
                <li v-for="source in otherSources">
                    <Source :name="source" :filter="filter"/>
                </li>
            </ul>
        </section>
    </div>
</template>

<script>
    import { templates, sources, sourcesForMultipleForms } from '../src/data'
    import { Source } from "../src/classes";

    export default {
        data() {
            return {
                templates: templates,
                sourcesForMultipleForms: sourcesForMultipleForms,
                sourceTypes: Source.TYPES,
                filter: '',
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
                for (let sources of Object.values(this.sourcesForMultipleForms)) {
                    for (let source of sources) {
                        other.delete(source);
                    }
                }
                return other;
            },
        },
        methods: {
            toId(str) {
                return str.replace(/\//g, '-').replace(/&/g, '_');
            }
        },
    }
</script>
