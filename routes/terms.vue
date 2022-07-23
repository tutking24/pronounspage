<template>
    <div>
        <h2>
            <Icon v="gavel"/>
            <T>terms.header</T>
        </h2>

        <p class="small"><em><T>terms.lastUpdate</T><T>quotation.colon</T> 2022-07-23</em></p>

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
            <template v-for="(violation, i) in forbidden"><T>terms.content.content.violationsExamples.{{violation}}</T><template v-if="i !== forbidden.length - 1">, </template></template>.
        </p>
        <p><T>terms.content.content.responsibility</T></p>

        <h3><T>terms.content.privacy.header</T></h3>
        <p><T>terms.content.privacy.effort</T></p>
        <p><T>terms.content.privacy.data</T></p>
        <p><T>terms.content.privacy.editRemoval</T></p>
        <p><T>terms.content.privacy.contact</T></p>
        <p><T>terms.content.privacy.cookies</T></p>
        <p><T>terms.content.privacy.plausible</T></p>
        <p><T>terms.content.privacy.arc</T></p>
        <p><T>terms.content.privacy.hCaptcha</T></p>
        <p><T>terms.content.privacy.logsBackups</T></p>
        <p><T>terms.content.privacy.gdpr</T></p>

        <h3><T>terms.content.closing.header</T></h3>
        <p><T>terms.content.closing.jurisdiction</T></p>
        <p><T>terms.content.closing.changes</T></p>
    </div>
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
