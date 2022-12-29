<template>
    <Page>
        <h2>
            <Icon v="user-secret"/>
            <T>privacy.header</T>
        </h2>

        <p class="small"><em>
            <T>terms.lastUpdate</T><T>quotation.colon</T>
            2022-12-29
            (registration of a legal entity; switching ads providers)
        </em></p>

        <div v-if="$te('terms.translationDisclaimer')" class="alert alert-warning">
            <Icon v="exclamation-triangle"/>
            <T>terms.translationDisclaimer</T>
        </div>

        <p>
            <T>privacy.content.intro</T>
            <a href="mailto:contact@pronouns.page" target="_blank" rel="noopener">contact@pronouns.page</a>.
        </p>
        <p><T>privacy.content.effort</T></p>
        <p><T>privacy.content.data</T></p>
        <p><T>privacy.content.editRemoval</T></p>
        <p><T>privacy.content.contact</T></p>
        <p><T>privacy.content.cookies</T></p>
        <p><T>privacy.content.plausible</T></p>
        <p><T>privacy.content.hCaptcha</T></p>
        <p v-if="config.ads && config.ads.enabled">
            <T>privacy.content.adsense</T>
        </p>
        <p><T>privacy.content.logsBackups</T></p>
        <p><T>privacy.content.gdpr</T></p>

        <template v-if="config.ads && config.ads.enabled">
            <hr/>
            <p>
                <a href="#" @click.prevent="revokeCookieConsent">
                    <Icon v="eraser"/>
                    <T>privacy.consent.revoke</T>
                </a>
            </p>
        </template>
    </Page>
</template>

<script>
export default {
    methods: {
        revokeCookieConsent() {
            googlefc.callbackQueue.push(googlefc.showRevocationMessage);
        },
    },
}
</script>
