<template>
    <NotFound v-if="!$admin()"/>
    <div v-else>
        <h2>
            <Icon v="user-cog"/>
            <T>admin.header</T>
        </h2>

        <section>
            <details class="border mb-3">
                <summary class="bg-light p-3">
                    <Icon v="users"/>
                    Users
                    ({{stats.users.overall}}, {{stats.users.admins}} admins)
                </summary>
                <div class="border-top">
                    <Table :data="Object.values(users)" :columns="4">
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
                                <a href="#" :class="['badge', s.el.roles === 'admin' ? 'badge-primary' : 'badge-light']"
                                   @click.prevent="setRole(s.el.id, s.el.roles === 'admin' ? 'user' : 'admin')">
                                    {{s.el.roles}}
                                </a>
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
                        <ul class="list-unstyled">
                            <li v-for="(count, pronoun) in locale.pronouns" v-if="count >= 10">
                                <strong>{{pronoun}}</strong>: {{count}}
                            </li>
                        </ul>
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
    import {head} from "../src/helpers";
    import {socialProviders} from "../src/data";

    export default {
        data() {
            return { socialProviders }
        },
        async asyncData({ app, store }) {
            if (!store.state.user || store.state.user.roles !== 'admin') {
                return {};
            }

            const stats = await app.$axios.$get(`/admin/stats`);

            const users = await app.$axios.$get(`/admin/users`);

            return {
                stats,
                users,
            };
        },
        methods: {
            async setRole(userId, role) {
                await this.$confirm(this.$t('admin.user.confirmRole', {username: this.users[userId].username, role}));

                const response = await this.$axios.$post(`/user/${userId}/set-roles`, { roles: role });

                this.users[userId].roles = role;
            }
        },
        head() {
            return head({
                title: this.$t('admin.header'),
            });
        },
    }
</script>
