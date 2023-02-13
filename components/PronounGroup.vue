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
                    <SimplePronounList :pronouns="pronounGroup.groupPronouns"/>
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
