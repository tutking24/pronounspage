<template>
    <Loading :value="circleMentions">
        <template v-slot:header>
            <h3 class="h4"><T>profile.circles.yourMentions.header</T><T>quotation.colon</T></h3>
        </template>
        <p class="small text-muted">
            <T>profile.circles.yourMentions.description</T>
        </p>
        <table class="table table-striped table-bordered">
            <tr v-if="!circleMentions || Object.keys(circleMentions).length === 0">
                <td class="text-center">
                    <T>table.empty</T>
                </td>
            </tr>
            <template v-else>
                <tr v-for="(profiles, username) in circleMentions">
                    <th>
                        <LocaleLink :link="`/@${username}`" locale="_">@{{username}}</LocaleLink>
                    </th>
                    <td>
                        <ul>
                            <li v-for="(relationship, locale) in profiles">
                                <LocaleLink :link="`/@${username}`" :locale="locale">{{ locales[locale].name }}</LocaleLink><T>quotation.colon</T>
                                {{ relationship }}
                            </li>
                        </ul>
                    </td>
                </tr>
            </template>
        </table>
    </Loading>
</template>

<script>
export default {
    data() {
        return {
            circleMentions: undefined,
        }
    },
    async mounted() {
        this.circleMentions = await this.$axios.$get(`/profile/my-circle-mentions`);
    }
}
</script>
