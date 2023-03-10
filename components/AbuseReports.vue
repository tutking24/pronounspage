<template>
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
            <th class="text-nowrap" v-if="abuseReports.length && abuseReports[0].snapshot">
                Snapshot
            </th>
        </template>

        <template v-slot:row="s"><template v-if="s && s.el.susUsername">
            <td>
                <a :href="`https://pronouns.page/@${s.el.susUsername}`" target="_blank" rel="noopener">@{{s.el.susUsername}}</a>
                <ul v-if="s.el.profiles" class="small list-inline">
                    <li v-for="locale in s.el.profiles.split(',')" class="list-inline-item mt-2">
                        <LocaleLink :locale="locale" :link="`/@${s.el.susUsername}`">{{ locales[locale]?.name || locale }}</LocaleLink>
                    </li>
                </ul>
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
                <a v-else-if="allowResolving" href="#" class="badge bg-light text-success border border-success"
                   @click.prevent="handleReport(s.el.id)"
                >
                    <Icon v="thumbs-up"/>
                    I checked the profile, it's OK.
                </a>
            </td>
            <td v-if="s.el.snapshot">
                <a href="#" class="badge bg-info"
                   @click.prevent="$alertRaw(s.el.snapshot)"
                >
                    <Icon v="camera-polaroid"/>
                    Snapshot
                </a>
            </td>
        </template></template>
    </Table>
</template>

<script>
export default {
    props: {
        abuseReports: {required: true},
        allowResolving: {type: Boolean},
    },
    methods: {
        formatComment(comment) {
            return comment
                .split(', ')
                .map(x => x.replace(/^(.*) \((.*)\)$/, '<dfn title="$2">$1</dfn>'))
                .join(', ');
        },
        async handleReport(id) {
            await this.$confirm('Are you sure you want to mark this report as handled?', 'success');
            await this.$post(`/admin/reports/handle/${id}`);
            this.abuseReports = this.abuseReports.map(r => {
                if (r.id === id) { r.isHandled = true; }
                return r;
            });
        },
    }
};
</script>
