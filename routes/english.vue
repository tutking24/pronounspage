<template>
    <Page>
        <LinksNav/>

        <h2>
            <Icon v="globe-americas"/>
            <T>english.headerLonger</T>
        </h2>

        <div>
            <T>english.intro</T>
        </div>

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
    </Page>
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
