<template>
    <div>
        <h2>
            <Icon v="user-friends"/>
            <T>people.headerLonger</T>
        </h2>

        <section>
            <T>people.intro</T>
        </section>

        <ul class="list-group">
            <li v-for="person in people" class="list-group-item">
                <h3 class="h4">
                    <strong>
                        {{person.name}}
                    </strong>
                </h3>
                <p>
                    {{person.description}}
                </p>
                <ul class="mb-2">
                    <li v-for="(pronouns, locale) in person.pronouns">
                        <T>people.languages.{{locale}}</T>:
                        <ul class="list-inline d-inline">
                            <li v-for="pronoun in pronouns" class="list-inline-item">
                                <LocaleLink :link="'/' + pronoun.link" :locale="locale">
                                    <strong>{{pronoun.display}}</strong>
                                </LocaleLink>
                            </li>
                        </ul>
                    </li>
                </ul>
                <!-- TODO <SourceList v-if="person.sources.length" :names="person.sources"/> -->
            </li>
        </ul>

        <ScrollButton/>
    </div>
</template>

<script>
    import { people } from "~/src/data";
    import { head } from "../src/helpers";
    import {SourceLibrary} from "../src/classes";

    export default {
        data() {
            return {
                people,
            }
        },
        async asyncData({app}) {
            return {
                sources: await app.$axios.$get(`/sources`),
            }
        },
        head() {
            return head({
                title: this.$t('people.headerLonger'),
                description: this.$t('people.description'),
            });
        },
        computed: {
            sourceLibrary() {
                return new SourceLibrary(this.sources);
            },
        },
    }
</script>
