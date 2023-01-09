<template>
    <Page wide>
        <NotFound v-if="!$isGranted('translations')"/>
        <div v-else>
            <p>
                <nuxt-link to="/admin">
                    <Icon v="user-cog"/>
                    <T>admin.header</T>
                </nuxt-link>
            </p>
            <h2>
                <Icon v="language"/>
                Translation proposals ({{translationProposals.length}})
            </h2>

            <section v-if="translationProposals && translationProposals.length">
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

                <details class="border mb-3" :open="$isGranted('code')">
                    <summary class="bg-light p-3">
                        <span class="badge bg-success">Merge</span>
                    </summary>
                    <div class="p-2">
                        <p>
                            We still need to <strong>manually</strong> move the translations to the <code>translations.suml</code> file,
                            but at least it should be easy to copy paste bits from here:
                        </p>
                        <hr/>

                        <pre>{{translationsProposalsSuml}}</pre>
                        <hr/>
                        <button v-if="$isGranted('code')" class="btn btn-success" @click="markTranslationProposalsDone">
                            Merged to the main branch, mark as done
                        </button>
                        <p v-else>
                            If you know Git and YAML/SUML, you can create a pull request for these changes.
                            You can also ask <nuxt-link to="/@andrea">@andrea</nuxt-link> for `code` permissions
                            – `code` access means you'll be getting notifications about new translations awaiting merging
                            and will be able to mark them as merged in the database.
                        </p>
                    </div>
                </details>
            </section>
        </div>
    </Page>
</template>

<script>
import {deepSet, head} from "../src/helpers";
import translator from "../src/translator";
import Suml from 'suml';

export default {
    data() {
        return {
            translator,
        }
    },
    async asyncData({ app }) {
        return {
            translationProposals: await app.$axios.$get(`/translations/proposals`),
        };
    },
    methods: {
        async acceptTranslationProposal(id) {
            // await this.$confirm('Do you want to accept this translation proposal?', 'success');
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
            await this.$confirm(`This will mark all approved translations as done and they'll disappear from here –
                but they'll only actually show up on production if they are added to the <code>translations.suml</code> file
                and merged to the <code>main</code> branch.
                Do you confirm that those translations are present in the <code>main</code> branch?`, 'success');
            await this.$post(`/translations/proposals-done`)
            this.translationProposals = this.translationProposals.filter(tp => tp.status === 1);
        },
    },
    computed: {
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
    head() {
        return head({
            title: this.$t('admin.header') + ' • Translation proposals',
        });
    },
}
</script>
