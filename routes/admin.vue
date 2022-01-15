<template>
    <NotFound v-if="!$isGranted('panel') && !$isGranted('users')"/>
    <div v-else>
        <h2>
            <Icon v="user-cog"/>
            <T>admin.header</T>
        </h2>

        <p>Stats counted: {{$datetime(stats.calculatedAt)}}</p>

        <section v-if="$isGranted('users')">
            <details class="border mb-3" @click="usersShown = true">
                <summary class="bg-light p-3">
                    <Icon v="users"/>
                    Users
                    ({{stats.users.overall}} overall, {{stats.users.admins}} admins)
                </summary>
                <div class="border-top" v-if="usersShown">
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
                                <a href="#" class="badge bg-primary text-white" @click.prevent="impersonate(s.el.username)"><Icon v="user-secret"/></a>
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

        <ChartSet name="users" :data="stats.users.chart" init="cumulative"/>

        <Chart label="number of profiles by locale" :data="profilesByLocale" type="bar" :options="{
            indexAxis: 'y',
            responsive: true,
            interaction: {
                intersect: false,
                mode: 'y',
            },
        }"/>

        <section>
            <Icon v="id-card"/>
            Cards in queue for generation:
            {{ stats.cardsQueue }}
        </section>

        <section>
            <Icon v="user-secret"/>
            Impersonate <button class="btn btn-primary btn-sm" @click="impersonate('example@pronouns.page')">@example</button>
        </section>

        <section v-if="$isGranted('users')">
            <h3>
                <Icon v="siren-on"/>
                Abuse reports
            </h3>
            <Table :data="abuseReports" :columns="4">
                <template v-slot:header>
                    <th class="text-nowrap">
                        Suspicious account
                    </th>
                    <th class="text-nowrap">
                        Reported by
                    </th>
                    <th class="text-nowrap">
                        Comment
                    </th>
                    <th class="text-nowrap">
                        Action
                    </th>
                </template>

                <template v-slot:row="s"><template v-if="s && s.el.susUsername">
                    <td>
                        <a :href="`https://pronouns.page/@${s.el.susUsername}`" target="_blank" rel="noopener">@{{s.el.susUsername}}</a>
                    </td>
                    <td>
                        <span v-if="s.el.isAutomatic" class="badge bg-info">
                            Keyword found
                        </span>
                        <a v-else :href="`https://pronouns.page/@${s.el.reporterUsername}`" target="_blank" rel="noopener">@{{s.el.reporterUsername}}</a>
                        <small>({{$datetime($ulidTime(s.el.id))}})</small>
                    </td>
                    <td class="small" v-html="s.el.isAutomatic ? formatComment(s.el.comment) : s.el.comment"></td>
                    <td>
                        <span v-if="s.el.isHandled" class="badge bg-success">
                            Case closed
                        </span>
                        <a v-else href="#" class="badge bg-light text-success border border-success"
                           @click.prevent="handleReport(s.el.id)"
                        >
                            <Icon v="thumbs-up"/>
                            I checked the profile, it's OK.
                        </a>
                    </td>
                </template></template>
            </Table>
        </section>

        <section v-for="(locale, k) in stats.locales" :key="k">
            <details class="border mb-3" open>
                <summary class="bg-light p-3">
                    <LocaleLink :locale="k" link="/">{{locale.name}}</LocaleLink>
                </summary>
                <div class="p-3 border-top d-flex justify-content-between flex-column flex-md-row">
                    <div class="flex-grow-1">
                        <h4 class="h5">
                            <Icon v="id-card"/>
                            Profiles
                        </h4>
                        {{locale.profiles}}
                    </div>
                    <div class="flex-grow-1">
                        <h4 class="h5">
                            <Icon v="tags"/>
                            Pronouns
                        </h4>
                        <ListExpandable :data="locale.pronouns"/>
                    </div>
                    <div class="flex-grow-1">
                        <h4 class="h5">
                            <Icon v="flag"/>
                            Flags
                        </h4>
                        <ListExpandable :data="locale.flags"/>
                    </div>
                    <div class="flex-grow-1">
                        <h4 class="h5">
                            <Icon v="atom-alt"/>
                            Dictionary
                        </h4>
                        <ul class="list-unstyled">
                            <li>
                                <strong>Approved</strong>: {{locale.nouns.approved}}
                            </li>
                            <li>
                                <strong>Awaiting</strong>: {{locale.nouns.awaiting}}
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="p-3 border-top">
                    <ChartSet name="profiles" :data="locale.chart"/>
                </div>
            </details>
        </section>
    </div>
</template>

<script>
    import {head} from "../src/helpers";
    import {socialProviders} from "../src/socialProviders";

    export default {
        data() {
            return {
                socialProviders,
                userFilter: '',
                userFilterDelayed: '',
                userFilterDelayHandle: undefined,
                localeFilter: true,
                adminsFilter: false,
                usersShown: false,
            }
        },
        async asyncData({ app, store }) {
            let stats = { users: {}};
            try {
                stats = await app.$axios.$get(`/admin/stats`);
            } catch {}

            let abuseReports = [];
            try {
                abuseReports = await app.$axios.$get(`/admin/reports`);
            } catch {}

            return {
                stats,
                abuseReports,
            };
        },
        methods: {
            async handleReport(id) {
                await this.$confirm('Are you sure you want to mark this report as handled?', 'success');
                await this.$post(`/admin/reports/handle/${id}`);
                this.abuseReports = this.abuseReports.map(r => {
                    if (r.id === id) { r.isHandled = true; }
                    return r;
                });
            },
            async impersonate(email) {
                const { token } = await this.$axios.$get(`/admin/impersonate/${encodeURIComponent(email)}`);
                this.$cookies.set('impersonator', this.$cookies.get('token'));
                this.$cookies.set('token', token);
                this.$router.push('/' + this.config.user.route);
                setTimeout(() => window.location.reload(), 500);
            },
            formatComment(comment) {
                return comment
                    .split(', ')
                    .map(x => x.replace(/^(.*) \((.*)\)$/, '<dfn title="$2">$1</dfn>'))
                    .join(', ');
            },
        },
        computed: {
            profilesByLocale() {
                const r = {};
                for (let locale of Object.values(this.stats.locales).sort((a, b) => b.profiles - a.profiles)) {
                    r[locale.name] = locale.profiles;
                }
                return r;
            },
        },
        watch: {
            userFilter() {
                if (this.userFilterDelayHandle !== undefined) {
                    clearInterval(this.userFilterDelayHandle);
                }

                this.userFilterDelayHandle = setTimeout(() => {
                    this.userFilterDelayed = this.userFilter;
                }, 500);
            },
        },
        head() {
            return head({
                title: this.$t('admin.header'),
            });
        },
    }
</script>
