<template>
    <NotFound v-if="!$admin()"/>
    <div v-else class="container">
        <h2>
            <Icon v="user-cog"/>
            <T>admin.header</T>
        </h2>

        <Table :data="users" :columns="4">
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
                    <a :href="`mailto:${s.el.email}`" target="_blank" rel="noopener">
                        {{s.el.email}}
                    </a>
                </td>
                <td>
                    <span :class="['badge', s.el.roles === 'admin' ? 'badge-primary' : 'badge-light']">
                        {{s.el.roles}}
                    </span>
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

    export default {
        async asyncData({ app, store }) {
            if (!store.state.user || store.state.user.roles !== 'admin') {
                return {};
            }

            const users = await app.$axios.$get(`/admin/users`, { headers: {
                authorization: 'Bearer ' + store.state.token,
            } });

            return {
                users: Object.values(users),
            };
        },
        head() {
            return head({
                title: this.$t('admin.header'),
            });
        },
    }
</script>
