<template>
    <Page>
    <NotFound v-if="!$isGranted('users') && !$isGranted('terms') && !$isGranted('sources')"/>
    <div v-else>
        <p>
            <nuxt-link to="/admin">
                <Icon v="user-cog"/>
                <T>admin.header</T>
            </nuxt-link>
        </p>
        <h2>
            <Icon v="user-cog"/>
            Moderation rules
        </h2>

        <ModerationRules v-if="$isGranted('users')" type="rulesUsers" label="Banning accounts" open/>
        <ModerationRules v-if="$isGranted('terms')" type="rulesTerminology" label="Terminology" open/>
        <ModerationRules v-if="$isGranted('sources')" type="rulesSources" label="Sources" open/>
        <ModerationRules v-if="$isGranted('users')" type="susRegexes" label="Keywords for automated triggers"/>
    </div>
    </Page>
</template>

<script>
import {head} from "../src/helpers";

export default {
    head() {
        return head({
            title: this.$t('admin.header') + ' • Moderation rules',
        });
    },
}
</script>
