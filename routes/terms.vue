<template>
    <Page>
        <h2>
            <Icon v="gavel"/>
            <T>terms.header</T>
        </h2>

        <p class="small"><em>
            <T>terms.lastUpdate</T><T>quotation.colon</T>
            2023-03-06
            (explicit mention of ableism)
        </em></p>

        <div v-if="$te('terms.translationDisclaimer')" class="alert alert-warning">
            <Icon v="exclamation-triangle"/>
            <T>terms.translationDisclaimer</T>
        </div>

        <p>
            <T>terms.content.intro</T>
            <a href="mailto:contact@pronouns.page" target="_blank" rel="noopener">contact@pronouns.page</a>.
        </p>
        <p><T>terms.content.consent</T></p>

        <h3><T>terms.content.accounts.header</T></h3>
        <p><T>terms.content.accounts.age</T></p>
        <p><T>terms.content.accounts.authentication</T></p>
        <p><T>terms.content.accounts.termination</T></p>
        <p><T>terms.content.accounts.inactivity</T></p>

        <h3><T>terms.content.content.header</T></h3>
        <p><T>terms.content.content.ownership</T></p>
        <p><T>terms.content.content.liability</T></p>
        <p>
            <T>terms.content.content.violations</T>
            <template v-for="(violation, i) in forbidden"><T>terms.content.content.violationsExamples.{{violation}}</T><sup v-if="violation === 'ableism' && new Date < new Date(2023, 3, 6)"> (this clause comes into effect on April 6th, 2023)</sup><template v-if="i !== forbidden.length - 1"><T>terms.content.content.violationsSeparator</T></template></template><T>terms.content.content.violationsEnd</T>
            <T>terms.content.content.violationsStrict</T>
        </p>
        <p><T>terms.content.content.responsibility</T></p>

        <h3><T>terms.content.closing.header</T></h3>
        <p><T>terms.content.closing.jurisdiction</T></p>
        <p><T>terms.content.closing.changes</T></p>
    </Page>
</template>

<script>
    import forbidden from "../src/forbidden";

    export default {
        data() {
            return {
                forbidden,
            };
        }
    }
</script>
