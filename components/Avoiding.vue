<template>
    <div v-if="config.pronouns.null && config.pronouns.null.ideas && config.pronouns.null.ideas.length">
        <section v-for="idea in config.pronouns.null.ideas">
            <h3>
                {{idea.header}}
            </h3>
            <p v-if="idea.description">
                {{idea.description}}
            </p>
            <p v-if="idea.normative">
                <NormativeBadge/>
            </p>
            <ul>
                <li v-for="[exampleFrom, exampleTo] in idea.examples">
                    <LinkedText :text="exampleFrom"/> → <strong><LinkedText :text="exampleTo"/></strong>
                </li>
            </ul>
        </section>

        <section v-if="sources && sources[''].length">
            <Literature :sources="sources"/>
        </section>
    </div>
</template>

<script>
    import {SourceLibrary} from "../src/classes";

    export default {
        data() {
            return {
                sources: undefined,
            }
        },
        async mounted() {
            if (!this.config.pronouns.null.routes) {
                return;
            }
            const key = this.config.pronouns.null.routes[0];
            this.sources = {
                '': new SourceLibrary(await this.$axios.$get(`/sources?pronoun=${key}`)).getForPronoun(key),
            };
        },
    };
</script>
