<template>
    <Page>
    <NotFound v-if="!$isGranted('users')"/>
    <div v-else>
        <p>
            <nuxt-link to="/admin">
                <Icon v="user-cog"/>
                <T>admin.header</T>
            </nuxt-link>
        </p>
        <h2>
            <Icon v="ban"/>
            Pending bans
            ({{banProposals ? banProposals.length : 0}})
        </h2>

        <section>
            <table class="table table-striped">
                <thead>
                <tr>
                    <th>User</th>
                    <th>Votes</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="proposal in banProposals">
                    <td>
                        <a :href="`https://pronouns.page/@${proposal.username}`" target="_blank" rel="noopener">@{{proposal.username}}</a>
                        <ul class="small list-inline" v-if="proposal.profiles">
                            <li v-for="locale in proposal.profiles.split(',')" v-if="allLocales[locale]" class="list-inline-item">
                                <LocaleLink :link="`/@${proposal.username}`" :locale="locale">
                                    {{ allLocales[locale].name }}
                                </LocaleLink>
                            </li>
                        </ul>
                    </td>
                    <td>
                        {{proposal.votes}}
                    </td>
                </tr>
                </tbody>
            </table>
        </section>
    </div>
    </Page>
</template>

<script>
import {head} from "../src/helpers";

export default {
    async asyncData({ app }) {
        return {
            banProposals: await app.$axios.$get(`/admin/ban-proposals`),
            allLocales: await app.$axios.$get(`/admin/all-locales`),
        };
    },
    head() {
        return head({
            title: this.$t('admin.header') + ' • Pending bans',
        });
    },
}
</script>
