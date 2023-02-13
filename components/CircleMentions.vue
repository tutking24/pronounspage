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
                    <td style="max-width: 4rem">
                        <button class="btn btn-link btn-sm text-danger" @click="removeSelf(username)">
                            <Icon v="trash"/>
                            <T>profile.circles.removeSelf.action</T>
                        </button>
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
    },
    methods: {
        async removeSelf(username) {
            await this.$confirm(this.$t('profile.circles.removeSelf.confirm', {username}), 'warning');
            await this.$post(`/profile/remove-self-circle/${encodeURIComponent(username)}`);
            window.location.reload();
        }
    }
}
</script>
