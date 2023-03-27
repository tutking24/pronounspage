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
            <Icon v="user-cog"/>
            Users
        </h2>

        <section>
            <details class="border mb-3" @click="showUsers = true">
                <summary class="bg-light p-3">
                    <Icon v="users"/>
                    Users
                    ({{stats._.users}} overall, {{stats._.admins}} admins)
                </summary>
                <div class="border-top" v-if="showUsers">
                    <div class="input-group mt-4">
                        <input class="form-control" v-model="userFilter" :placeholder="$t('crud.filterLong')"/>
                        <button :class="['btn', adminsFilter ? 'btn-secondary' : 'btn-outline-secondary']"
                                @click="adminsFilter = !adminsFilter"
                        >
                            Only admins
                        </button>
                        <button :class="['btn', localeFilter ? 'btn-secondary' : 'btn-outline-secondary']"
                                @click="localeFilter = !localeFilter"
                        >
                            Only this version
                        </button>
                    </div>
                    <ServerTable
                        endpoint="/admin/users"
                        :query="{filter: userFilterDelayed || undefined, localeFilter: localeFilter || undefined, adminsFilter: adminsFilter || undefined}"
                        :columns="5"
                        count
                    >
                        <template v-slot:header>
                            <th class="text-nowrap">
                                <T>admin.user.user</T>
                            </th>
                            <th class="text-nowrap">
                                <T>admin.user.createdAt</T>
                            </th>
                            <th class="text-nowrap">
                                <T>admin.user.email</T>
                            </th>
                            <th class="text-nowrap">
                                <T>admin.user.roles</T>
                            </th>
                            <th class="text-nowrap">
                                <T>admin.user.profiles</T>
                            </th>
                        </template>

                        <template v-slot:row="s">
                            <td>
                                <a :href="'https://pronouns.page/@' + s.el.username">@{{s.el.username}}</a>
                                <a v-if="$isGranted('*') || $isGranted('impersonate')" href="#" class="badge bg-primary text-white" @click.prevent="impersonate(s.el.email)"><Icon v="user-secret"/></a>
                                <a v-if="$isGranted('users')" href="#" class="badge bg-danger text-white" @click.prevent="erasure(s.el.id, s.el.email)"><Icon v="truck-plow"/></a>
                            </td>
                            <td>
                                {{$datetime($ulidTime(s.el.id))}}
                            </td>
                            <td>
                                <p>
                                    <a :href="`mailto:${s.el.email}`" target="_blank" rel="noopener">
                                        {{s.el.email}}
                                    </a>
                                </p>
                                <!--
                                <ul v-if="s.el.socialConnections.length" class="list-inline">
                                    <li v-for="conn in s.el.socialConnections" class="list-inline-item">
                                        <Icon :v="socialProviders[conn].icon || conn" set="b"/>
                                    </li>
                                </ul>
                                -->
                            </td>
                            <td>
                                <Roles :user="s.el"/>
                            </td>
                            <td>
                                <ul class="list-unstyled">
                                    <li v-for="locale in s.el.profiles" v-if="locales[locale]">
                                        <LocaleLink :link="`/@${s.el.username}`" :locale="locale">
                                            {{ locales[locale].name }}
                                        </LocaleLink>
                                    </li>
                                </ul>
                            </td>
                        </template>
                    </ServerTable>
                </div>
            </details>
        </section>

        <section>
            <ChartSet name="users" :data="chart" init="cumulative"/>
        </section>

        <section>
            <Chart label="number of profiles by locale" :data="profilesByLocale" type="bar" :options="{
                indexAxis: 'y',
                responsive: true,
                interaction: {
                    intersect: false,
                    mode: 'y',
                },
            }"/>
        </section>
    </div>
    </Page>
</template>

<script>
import {deepSet, head} from "../src/helpers";
import {socialProviders} from "../src/socialProviders";
import translator from '../src/translator';
import Suml from 'suml';

export default {
    data() {
        return {
            socialProviders,
            showUsers: false,
            userFilter: '',
            userFilterDelayed: '',
            userFilterDelayHandle: undefined,
            localeFilter: true,
            adminsFilter: false,
        }
    },
    async asyncData({ app }) {
        return {
            stats: await app.$axios.$get(`/admin/stats`),
            chart: await app.$axios.$get(`/admin/stats/users-chart/_`),
        };
    },
    methods: {
        async impersonate(email) {
            const { token } = await this.$axios.$get(`/admin/impersonate/${encodeURIComponent(email)}`);
            this.$cookies.set('impersonator', this.$cookies.get('token'));
            this.$cookies.set('token', token);
            await this.$router.push('/' + this.config.user.route);
            setTimeout(() => window.location.reload(), 500);
        },
        async erasure(id, email) {
            await this.$confirm(`Are you sure you want to remove this account (${email})? ` +
                'This should only be done in two cases: ' +
                'an explicit GPDR request directly from the user, ' +
                'or having proof that owner is not yet 13 years old.', 'danger');

            if (await this.$axios.$post(`/user/data-erasure/${id}`)) {
                await this.$alert(`Account ${email} removed successfully`, 'success');
            } else {
                await this.$alert(this.$t('error.generic', 'danger'));
            }
        },
    },
    watch: {
        userFilter() {
            if (this.userFilterDelayHandle !== undefined) {
                clearInterval(this.userFilterDelayHandle);
            }

            this.userFilterDelayHandle = setTimeout(() => {
                this.userFilterDelayed = this.userFilter;
            }, 750);
        },
    },
    computed: {
        profilesByLocale() {
            const r = {};

            Object.entries(this.stats)
                .filter(([locale, localeStats]) => locale !== '_' && locale !== 'calculatedAt')
                .sort(([aLocale, aLocaleStats], [bLocale, bLocaleStats]) => bLocaleStats.users - aLocaleStats.users)
                .forEach(([locale, localeStats]) => {
                    r[locale] = localeStats.users;
                });

            return r;
        },
    },
    head() {
        return head({
            title: this.$t('admin.header') + ' • Users',
        });
    },
}
</script>
