<template>
    <Page>
    <NotFound v-if="!$isGranted('panel') && !$isGranted('users')"/>
    <div v-else>
        <h2>
            <Icon v="user-cog"/>
            <T>admin.header</T>
        </h2>

        <p>Stats counted: {{$datetime(stats.calculatedAt)}}</p>

        <p><nuxt-link to="/admin/moderation" class="btn btn-outline-primary">Moderation rules</nuxt-link></p>

        <p>
            Email notifications when there's items to moderate:
        </p>
        <p>
            <span v-for="(label, value) in {0: 'Never', 1: 'Daily', 7: 'Weekly'}" class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="inlineRadioOptions" :id="`notifiactionFrequency_${value}`" :value="value" v-model="adminNotifications">
                <label class="form-check-label" :for="`notifiactionFrequency_${value}`">{{label}}</label>
            </span>
        </p>

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
                                <a v-if="$isGranted('*')" href="#" class="badge bg-primary text-white" @click.prevent="impersonate(s.el.email)"><Icon v="user-secret"/></a>
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

        <section v-if="$isGranted('translations') && missingTranslations.length">
            <h3>
                <Icon v="language"/>
                Missing translations ({{missingTranslations.length}})
            </h3>
            <p>
                In order to start translating, enable translation mode with the button in bottom right corner.
                Then you can propose translations both her as well as in context anywhere on the site.
            </p>
            <div class="table-responsive">
                <table class="table table-bordered">
                    <thead>
                    <tr>
                        <th>key</th>
                        <th>base</th>
                        <th>translation</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="mt in missingTranslations">
                        <td>{{mt}}</td>
                        <td>{{translator.get(mt, false, true)}}</td>
                        <td><T>{{mt}}</T></td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </section>

        <template v-if="$isGranted('translations')">
            <Loading :value="translationProposals">
                <section v-if="translationProposals && translationProposals.length">
                     <h3>
                        <Icon v="language"/>
                        Translation proposals ({{translationProposals.length}})
                    </h3>

                    <div class="table-responsive">
                        <table class="table table-bordered">
                            <thead>
                            <tr>
                                <th>key</th>
                                <th>base</th>
                                <th>translation</th>
                                <th>author & status</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="tp in translationProposals">
                                <td>{{tp.tKey}}</td>
                                <td>{{translator.get(tp.tKey, false, true)}}</td>
                                <td v-if="Array.isArray(tp.tValue)">
                                    <ul>
                                        <li v-for="el in tp.tValue">{{el}}</li>
                                    </ul>
                                </td>
                                <td v-else>
                                    {{tp.tValue}}
                                </td>
                                <td>
                                    <nuxt-link :to="`/@${tp.author}`">@{{tp.author}}</nuxt-link>
                                    <br/>
                                    <template v-if="tp.status === 0">
                                        <span class="badge bg-warning text-white">Awaiting approval</span>
                                        <button class="btn btn-sm btn-outline-success" @click="acceptTranslationProposal(tp.id)">Accept</button>
                                        <button class="btn btn-sm btn-outline-danger" @click="rejectTranslationProposal(tp.id)">Reject</button>
                                    </template>
                                    <span v-else class="badge bg-success text-white">Approved</span>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>

                    <details class="border mb-3">
                        <summary class="bg-light p-3">
                            <span class="badge bg-success">Merge</span>
                        </summary>
                        <div class="p-2">
                            <p>
                                We still need to manually move the translations to the relevant SUML file,
                                but at least it should be easy to copy paste bits from here:
                            </p>
                            <hr/>
                            <pre>{{translationsProposalsSuml}}</pre>
                            <hr/>
                            <button class="btn btn-success" @click="markTranslationProposalsDone">Copied, mark as done</button>
                        </div>
                    </details>
                </section>
            </Loading>
        </template>

        <section v-if="$isGranted('users')">
            <h3>
                <Icon v="siren-on"/>
                Abuse reports
                ({{abuseReportsActiveCount}})
            </h3>
            <ModerationRules type="rulesUsers" emphasise/>
            <ModerationRules type="susRegexes" label="Keywords for automated triggers"/>
            <Loading :value="abuseReports">
                <AbuseReports :abuseReports="abuseReports" allowResolving/>
            </Loading>
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
                userFilter: '',
                userFilterDelayed: '',
                userFilterDelayHandle: undefined,
                localeFilter: true,
                adminsFilter: false,
                usersShown: false,
                adminNotifications: this.$user() ? (this.$user().adminNotifications ?? 7) : 7,
                translator,
                missingTranslations: translator.listMissingTranslations(),
                abuseReports: undefined,
                translationProposals: undefined,
            }
        },
        async asyncData({ app, store }) {
            let stats = { users: {}};
            try {
                stats = await app.$axios.$get(`/admin/stats`);
            } catch {}

            return {
                stats,
            };
        },
        async mounted() {
            this.$axios.$get(`/admin/reports`)
                .then(r => this.abuseReports = r)
                .catch();

            this.$axios.$get(`/translations/proposals`)
                .then(r => this.translationProposals = r)
                .catch();
        },
        methods: {
            async impersonate(email) {
                const { token } = await this.$axios.$get(`/admin/impersonate/${encodeURIComponent(email)}`);
                this.$cookies.set('impersonator', this.$cookies.get('token'));
                this.$cookies.set('token', token);
                await this.$router.push('/' + this.config.user.route);
                setTimeout(() => window.location.reload(), 500);
            },
            async acceptTranslationProposal(id) {
                await this.$confirm('Do you want to accept this translation proposal?', 'success');
                await this.$post(`/translations/accept-proposal`, {id})
                this.translationProposals = this.translationProposals.map(tp => {
                    if (tp.id === id) { tp.status = 1; }
                    return tp;
                });
                this.$forceUpdate();
            },
            async rejectTranslationProposal(id) {
                await this.$confirm('Do you want to reject this translation proposal?', 'danger');
                await this.$post(`/translations/reject-proposal`, {id})
                this.translationProposals = this.translationProposals.filter(tp => tp.id !== id);
            },
            async markTranslationProposalsDone() {
                await this.$confirm('Did you put the translations in the SUML file and want to mark them as done?', 'success');
                await this.$post(`/translations/proposals-done`)
                this.translationProposals = this.translationProposals.filter(tp => tp.status === 1);
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
            abuseReportsActiveCount() {
                return this.abuseReports ? this.abuseReports.filter(r => !r.isHandled).length : '–';
            },
            translationsProposalsSuml() {
                const data = {};
                for (let tp of this.translationProposals || []) {
                    if (tp.status === 1) {
                        deepSet(data, tp.tKey, tp.tValue);
                    }
                }
                return new Suml().dump(data);
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
            async adminNotifications() {
                const res = await this.$axios.$post(`/admin/set-notification-frequency`, {frequency: parseInt(this.adminNotifications)});
                this.$store.commit('setToken', res.token);
            },
        },
        head() {
            return head({
                title: this.$t('admin.header'),
            });
        },
    }
</script>
