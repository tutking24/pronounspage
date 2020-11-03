<template>
    <NotFound v-if="!$admin()"/>
    <div v-else class="container">
        <h2>
            <Icon v="user-cog"/>
            <T>admin.header</T>
        </h2>

        <Table :data="Object.values(users)" :columns="4" count>
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

            const users = await app.$axios.$get(`/admin/users`, { headers: {
                authorization: 'Bearer ' + store.state.token,
            } });

            return {
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
