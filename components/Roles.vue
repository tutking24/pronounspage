<template>
    <form v-if="$isGranted('*')">
        <ListInput v-model="roles" v-slot="s" :prototype="{locale: config.locale, area: '*'}">
            <select v-model="s.val.locale" class="form-control">
                <option v-for="l in allLocales" :value="l">{{l}}</option>
            </select>
            <select v-model="s.val.area" class="form-control">
                <option v-for="a in allAreas" :value="a">{{a}}</option>
            </select>
        </ListInput>
        <button class="btn btn-outline-primary" @click.prevent="save">Save</button>
    </form>
    <ul v-else class="list-unstyled">
        <li v-for="role in user.roles.split('|')">
            <span class="badge bg-primary text-white">{{role}}</span>
        </li>
    </ul>
</template>

<script>
    export default {
        props: {
            user: { required: true },
        },
        data() {
            return {
                roles: (this.user.roles ? this.user.roles.split('|') : []).map(r => {
                    if (r === '*') { r = '*-*'; }
                    const [ locale, area ] = r.split('-');
                    return { locale, area };
                }),
                allLocales: ['*', ...Object.keys(this.locales)],
                allAreas: [
                    '*',
                    'panel',
                    'users',
                    'sources',
                    'nouns',
                    'terms',
                    'inclusive',
                    'census',
                ],
            };
        },
        methods: {
            async save() {
                const roles = this.roles.map(r => {
                    if (r.locale === '*' && r.area === '*') {
                        return '*';
                    }
                    return `${r.locale}-${r.area}`;
                }).join('|');

                await this.$confirm(this.$t('admin.user.confirmRole', {username: this.user.username, role: roles}));

                const response = await this.$axios.$post(`/user/${this.user.id}/set-roles`, { roles:  roles});

                this.user.roles = roles;
            }
        },
    }
</script>
