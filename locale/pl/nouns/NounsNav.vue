<template>
    <section class="btn-group btn-block mb-2">
        <a :href="'#' + $t('nouns.neuterNouns.id')" class="btn btn-outline-primary">
            <Icon v="atom-alt"/>
            <T>nouns.neuterNouns.header</T>
        </a>
        <a :href="'#' + $t('nouns.dukajNouns.id')" class="btn btn-outline-primary">
            <Icon v="atom-alt"/>
            <T>nouns.dukajNouns.header</T>
        </a>
        <a :href="'#' + $t('nouns.personNouns.id')" class="btn btn-outline-primary">
            <Icon v="atom-alt"/>
            <T>nouns.personNouns.header</T>
        </a>
    </section>
</template>
