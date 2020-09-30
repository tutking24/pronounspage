<template>
    <div class="container">
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
                                <a :href="`${locales[locale].url}/${pronoun.link}`" target="_blank" rel="noopener">
                                    <strong>{{pronoun.display}}</strong>
                                </a>
                            </li>
                        </ul>
                    </li>
                </ul>
                <ul v-if="person.sources.length" class="list-unstyled mt-3">
                    <li v-for="source in person.sources">
                        <Source :name="source"/>
                    </li>
                </ul>
            </li>
        </ul>

        <ScrollButton/>
    </div>
</template>

<script>
    import { people } from "~/src/data";
    import { head } from "../src/helpers";

    export default {
        data() {
            return {
                people,
            }
        },
        head() {
            return head({
                title: this.$t('people.headerLonger'),
                description: this.$t('people.description'),
            });
        },
    }
</script>
