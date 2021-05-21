<template>
    <div>
        <h2>
            <T>pronouns.avoiding.header</T>
        </h2>

        <p>
            <T>pronouns.avoiding.description</T>
        </p>

        <section v-for="idea in $t('pronouns.avoiding.ideas')">
            <h3>{{idea.header}}</h3>
            <p v-if="idea.description">
                {{idea.description}}
            </p>
            <ul>
                <li v-for="[exampleFrom, exampleTo] in idea.examples">
                    <LinkedText :text="exampleFrom"/> → <strong><LinkedText :text="exampleTo"/></strong>
                </li>
            </ul>
        </section>

        <section v-if="sources && Object.keys(sources).length">
            <Literature :sources="sources"/>
        </section>
    </div>
</template>

<script>
    import {SourceLibrary} from "../src/classes";
    import { head } from "../src/helpers";

    export default {
        data() {
            return {
                sources: undefined,
            }
        },
        async mounted() {
            this.sources = {
                '': new SourceLibrary(await this.$axios.$get(`/sources?pronoun=${this.config.pronouns.avoiding}`)).getForPronoun(this.config.pronouns.avoiding),
            };
        },
        head() {
            return head({
                title: this.$t('pronouns.avoiding.header'),
            });
        },
    };
</script>
