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
    import locales from '../src/locales';
    const allLocales = ['*'];
    for (let [code,] of locales) {
        allLocales.push(code);
    }

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
                allLocales,
                allAreas: [
                    '*',
                    'basic',
                    'panel',
                    'users',
                    'sources',
                    'nouns',
                    'terms',
                    'inclusive',
                    'census',
                    'names',
                    'translations',
                    'code',
                    'org',
                    'impersonate',
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

                const response = await this.$post(`/user/${this.user.id}/set-roles`, { roles:  roles});

                this.user.roles = roles;
            }
        },
    }
</script>
