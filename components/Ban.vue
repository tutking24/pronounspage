<template>
    <div v-if="config.profile.editorEnabled && $user() && $user().username !== user.username">
        <section v-if="$user()">
            <a v-if="!showReportForm" href="#" @click.prevent="showReportForm = true" class="small">
                <Icon v="spider"/>
                <T>report.action</T>
            </a>
            <div v-else-if="!reported">
                <textarea v-model="reportComment" class="form-control" rows="3" :placeholder="$t('report.comment')" :disabled="saving" required></textarea>
                <div class="alert alert-info small mt-3">
                    <p><T>report.terms</T><T>quotation.colon</T></p>
                    <blockquote>
                        <T>terms.content.content.violations</T>
                        <template v-for="(violation, i) in forbidden"><T>terms.content.content.violationsExamples.{{violation}}</T><template v-if="i !== forbidden.length - 1">, </template></template>.
                    </blockquote>
                    <p class="mb-0"><T>report.hoarding</T></p>
                </div>
                <button class="btn btn-danger d-block w-100 mt-2" :disabled="saving || !reportComment" @click="report">
                    <Icon v="spider"/>
                    <T>report.action</T>
                </button>
            </div>
            <div v-else class="alert alert-success">
                <T>report.sent</T>
            </div>
        </section>
        <section v-if="$isGranted('users')">
            <a v-if="!showBanForm" href="#" @click.prevent="showBanForm = true" class="small">
                <Icon v="ban"/>
                <T>ban.action</T>
            </a>
            <div v-else>
                <div class="alert alert-warning">
                    <h5>Ban proposals</h5>
                    <p>
                        After at least 3 moderators had proposed bans,
                        you'll be able to pick one of the proposals in order to actually issue the ban.
                        If the proposed reasons/term points significantly differ
                        or if you think the person shouldn't be banned despite another moderator thinking otherwise,
                        please start a thread on Teams to discuss it.
                    </p>
                    <table class="table table-striped">
                        <thead>
                        <tr>
                            <th>Proposed at</th>
                            <th>Proposed by</th>
                            <th>Reason</th>
                            <th>Terms</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="proposal in banProposals">
                            <td>{{$datetime($ulidTime(proposal.id))}}</td>
                            <td class="small">
                                (TODO)<br/>
                                <span style="font-size: 0.5em">{{proposal.bannedBy}}</span>
                            </td>
                            <td>{{proposal.bannedReason}}</td>
                            <td><ul><li v-for="term in proposal.bannedTerms.split(',')">{{term}}</li></ul></td>
                            <td>
                                <button v-if="canApplyBan" class="btn btn-outline-danger btn-sm" @click="applyBan(proposal.id)">Apply ban</button>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <button v-if="isBanned && $isGranted('*')" class="btn btn-success btn-sm" @click="applyBan(0)">Unban</button>
                </div>
                <textarea v-model="user.bannedReason" class="form-control" rows="3" :placeholder="$t('ban.reason') + ' ' + $t('ban.visible')" :disabled="saving"></textarea>
                <div class="form-group">
                    <p class="my-1"><label><strong><T>ban.terms</T><T>quotation.colon</T></strong></label></p>
                    <div style="columns: 3" class="small">
                        <div class="form-check ps-0" v-for="violation in forbidden">
                            <label>
                                <input type="checkbox" :value="violation" v-model="user.bannedTerms"/>
                                <T>terms.content.content.violationsExamples.{{violation}}</T>
                            </label>
                        </div>
                    </div>
                </div>
                <button class="btn btn-danger d-block w-100 mt-2" :disabled="saving" @click="ban">
                    <Icon v="ban"/>
                    <T>ban.action</T>
                </button>
            </div>
            <ModerationRules type="rulesUsers" emphasise class="mt-4"/>
            <AbuseReports v-if="abuseReports.length" :abuseReports="abuseReports" allowResolving/>
        </section>
    </div>
</template>

<script>
    import ClientOnly from 'vue-client-only'
    import forbidden from "../src/forbidden";

    export default {
        components: { ClientOnly },
        props: {
            user: { required: true },
        },
        data() {
            return {
                showReportForm: false,
                reportComment: '',
                reported: false,

                showBanForm: !!this.user.bannedReason,
                isBanned: !!this.user.bannedReason,

                saving: false,

                forbidden,

                abuseReports: [],
                banProposals: [],
            }
        },
        async mounted() {
            if (!this.$isGranted('users')) { return; }
            this.abuseReports = await this.$axios.$get(`/admin/reports/${this.user.id}`);
            this.banProposals = await this.$axios.$get(`/admin/ban-proposals/${encodeURIComponent(this.user.username)}`);
            if (this.banProposals.length > 0) {
                this.showBanForm = true;
            }
        },
        methods: {
            async ban() {
                await this.$confirm(this.$t('ban.confirm', {username: this.user.username}), 'danger');
                this.saving = true;
                try {
                    await this.$post(`/admin/propose-ban/${encodeURIComponent(this.user.username)}`, {
                        reason: this.user.bannedReason,
                        terms: this.user.bannedTerms,
                    });
                    window.location.reload();
                } finally {
                    this.saving = false;
                }
            },
            async applyBan(proposalId) {
                await this.$confirm(this.$t('ban.confirm', {username: this.user.username}), 'danger');
                this.saving = true;
                try {
                    await this.$post(`/admin/apply-ban/${encodeURIComponent(this.user.username)}/${proposalId}`);
                    window.location.reload();
                } finally {
                    this.saving = false;
                }
            },
            async report() {
                if (!this.reportComment) { return; }
                await this.$confirm(this.$t('report.confirm', {username: this.user.username}), 'danger');
                this.saving = true;
                try {
                    await this.$post(`/profile/report/${encodeURIComponent(this.user.username)}`, {
                        comment: this.reportComment,
                    });
                    this.reported = true;
                } finally {
                    this.saving = false;
                }
            },
        },
        computed: {
            canApplyBan() {
                return !this.isBanned || this.$isGranted('users') && (this.banProposals.length >= 3 || this.$isGranted('*'));
            },
        }
    }
</script>
