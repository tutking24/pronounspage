<template>
    <section v-if="pronounGroup && pronounGroup.group.name">
        <ul class="list-group mt-4">
            <li class="list-group-item">
                <p class="h5">
                    <Spelling :text="pronounGroup.group.name"/>
                </p>
                <div v-if="pronounGroup.group.description" class="small my-1">
                    <Icon v="info-circle"/>
                    <em><LinkedText :text="pronounGroup.group.description"/></em>
                </div>
                <ul class="list-unstyled">
                    <li v-for="pronoun in pronounGroup.groupPronouns" :key="pronoun.canonicalName">
                        <nuxt-link v-if="typeof pronoun === 'string'" :to="'/' + pronoun">
                            <strong><Spelling :text="pronoun.replace(/&/g, ' ' + $t('pronouns.or') + ' ')"/></strong>
                        </nuxt-link>
                        <nuxt-link v-else :to="addSlash('/' + pronoun.canonicalName)">
                            <strong><Spelling :text="pronoun.name(glue)"/></strong><small v-if="pronoun.smallForm">/<Spelling :text="pronoun.morphemes[pronoun.smallForm]"/></small>
                            –
                            <small><Spelling :text="pronoun.description"/></small>
                        </nuxt-link>
                        <NormativeBadge v-if="pronoun.normative"/>
                    </li>
                </ul>
            </li>
            <nuxt-link :to="`/${config.pronouns.route}`" class="list-group-item list-group-item-action text-center">
                <Icon v="ellipsis-h-alt"/>
            </nuxt-link>
        </ul>
    </section>
</template>

<script>
    export default {
        props: {
            pronounGroup: {},
        },
        data() {
            return {
                glue: ' ' + this.$t('pronouns.or') + ' ',
            }
        },
        methods: {
            addSlash(link) {
                return link + (['*', `'`].includes(link.substr(link.length - 1)) ? '/' : '');
            },
        },
    };
</script>
