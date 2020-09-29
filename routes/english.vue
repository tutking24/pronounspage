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

        <ul class="list-group mt-5">
            <li v-for="templateGroup in config.english.templateGroups" class="list-group-item">
                <h3 class="h4">
                    {{templateGroup.name}}
                </h3>
                <p v-for="p in templateGroup.description" v-html="p"></p>
                <EnglishTable v-if="templateGroup.table" :t="templateGroup.table"/>
            </li>
        </ul>

        <ScrollButton/>
    </div>
</template>

<script>
    import EnglishTable from "../data/EnglishTable";
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
