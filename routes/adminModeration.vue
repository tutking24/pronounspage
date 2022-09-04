<template>
    <Page>
    <NotFound v-if="!$isGranted('users')"/>
    <div v-else>
        <h2>
            <Icon v="user-cog"/>
            Moderation rules
        </h2>

        <ModerationRules type="rulesUsers" label="Banning accounts" open/>
        <ModerationRules type="rulesTerminology" label="Terminology" open/>
        <ModerationRules type="rulesSources" label="Sources" open/>
        <ModerationRules type="susRegexes" label="Keywords for automated triggers"/>
    </div>
    </Page>
</template>
