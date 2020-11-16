<template>
    <div class="container">
        <h2>
            <Icon v="globe-americas"/>
            <T>english.headerLonger</T>
        </h2>

        <section>
            <T>english.intro</T>
        </section>

        <Separator icon="list"/>

        <section v-for="pronounGroup in config.english.pronounGroups">
            <h3>
                {{pronounGroup.name}}
            </h3>
            <p v-for="p in pronounGroup.description">
                <LinkedText :text="p"/>
            </p>
            <EnglishTable v-if="pronounGroup.table" :t="pronounGroup.table"/>
        </section>
    </div>
</template>

<script>
    import EnglishTable from "../data/pronouns/EnglishTable";
    import { head } from "../src/helpers";

    export default {
        components: { EnglishTable },
        head() {
            return head({
                title: this.$t('english.headerLonger'),
                description: this.$t('english.description'),
            });
        },
    }
</script>
