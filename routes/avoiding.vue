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
                    {{exampleFrom}} → <strong>{{exampleTo}}</strong>
                </li>
            </ul>
        </section>
    </div>
</template>

<script>
    import { head } from "../src/helpers";

    export default {
        head() {
            return head({
                title: this.$t('pronouns.avoiding.header'),
            });
        },
    };
</script>
