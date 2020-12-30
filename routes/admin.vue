<template>
    <NotFound v-if="!$isGranted('panel') && !$isGranted('users')"/>
    <div v-else>
        <h2>
            <Icon v="user-cog"/>
            <T>admin.header</T>
        </h2>

        <section v-if="$isGranted('users')">
            <details class="border mb-3">
                <summary class="bg-light p-3">
                    <Icon v="users"/>
                    Users
                    ({{stats.users.overall}} overall, {{stats.users.admins}} admins, {{visibleUsers.length}} visible)
                </summary>
                <div class="border-top">
                    <div class="input-group mt-4">
                        <input class="form-control" v-model="userFilter" :placeholder="$t('crud.filterLong')"/>
                        <span class="input-group-append">
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
                        </span>
                    </div>
                    <Table :data="visibleUsers" :columns="4">
                        <template v-slot:header>
                            <th class="text-nowrap">
                                <T>admin.user.user</T>
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
                                <Avatar :user="s.el" dsize="2rem"/>
                                {{s.el.username}}
                            </td>
                            <td>
                                <p>
                                    <a :href="`mailto:${s.el.email}`" target="_blank" rel="noopener">
                                        {{s.el.email}}
                                    </a>
                                </p>
                                <ul v-if="s.el.socialConnections.length" class="list-inline">
                                    <li v-for="conn in s.el.socialConnections" class="list-inline-item">
                                        <Icon :v="socialProviders[conn].icon || conn" set="b"/>
                                    </li>
                                </ul>
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
                    </Table>
                </div>
            </details>
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
            </details>
        </section>
    </div>
</template>

<script>
    import {head, isGranted} from "../src/helpers";
    import {socialProviders} from "../src/data";

    export default {
        data() {
            return {
                socialProviders,
                userFilter: '',
                localeFilter: true,
                adminsFilter: false,
            }
        },
        async asyncData({ app, store }) {
            let stats = { users: {}};
            let users = {};

            try {
                stats = await app.$axios.$get(`/admin/stats`);
            } catch {}

            try {
                users = await app.$axios.$get(`/admin/users`);
            } catch {}

            return {
                stats,
                users,
            };
        },
        computed: {
            visibleUsers() {
                return Object.values(this.users).filter(u =>
                    u.username.toLowerCase().includes(this.userFilter.toLowerCase())
                        && (!this.adminsFilter || u.roles !== '')
                        && (!this.localeFilter || u.profiles.includes(this.config.locale))
                );
            },
        },
        head() {
            return head({
                title: this.$t('admin.header'),
            });
        },
    }
</script>
