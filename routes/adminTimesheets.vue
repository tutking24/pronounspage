<template>
    <Page wide>
    <NotFound v-if="!$isGranted('panel')"/>
    <div v-else>
        <p>
            <nuxt-link to="/admin">
                <Icon v="user-cog"/>
                <T>admin.header</T>
            </nuxt-link>
        </p>
        <div v-html="moderation.timesheets"/>

        <hr/>

        <h3>
            Year:
            <button class="btn btn-sm btn-primary" @click="year--" :disabled="year - 1 < min.year"><Icon v="caret-left"/></button>
            {{year}}
            <button class="btn btn-sm btn-primary" @click="year++" :disabled="year + 1 > max.year"><Icon v="caret-right"/></button>
        </h3>

        <div class="table-responsive">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>Area</th>
                        <th v-for="month in months">{{month}}</th>
                        <th>Sum</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="area in areas">
                        <th>{{area}}</th>
                        <td v-for="(month, m) in months">
                            <input v-model.number="timesheet[year][m][area]"
                                   :ref="`cell-${m}-${areas.indexOf(area)}`"
                                   type="number"
                                   min="0"
                                   max="160"
                                   step="0.5"
                                   class="form-control form-control-sm"
                                   style="min-width: 3rem"
                                   @focus="focusMonth = parseInt(m);focusArea = areas.indexOf(area)"
                                   @keydown="cellKeydown"
                                   :disabled="dt(year, m) < closed || dt(year, m) > max"
                            />
                        </td>
                        <td>
                            <strong>
                                {{ sumCells(area, undefined) }}
                            </strong>
                        </td>
                    </tr>
                    <tr>
                        <th>Sum</th>
                        <td v-for="(month, m) in months">
                            <strong>
                                {{ sumCells(undefined, m) }}
                            </strong>
                        </td>
                        <td>
                            <strong>
                                {{ sumCells(undefined, undefined) }}
                            </strong>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <section>
            <p>
                <strong>Transfer method:</strong>
                <span v-for="(label, value) in transferMethods" class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="inlineRadioOptions" :id="`method_${value}`" :value="value" v-model="transferMethod">
                    <label class="form-check-label" :for="`method_${value}`">{{label}}</label>
                </span>
            </p>
            <div v-if="transferMethod === 'bank'" class="mb-3">
                <label for="bank_name" class="form-label">Owner name</label>
                <input v-model="transferDetails.bank_name" type="text" class="form-control" id="bank_name" placeholder="Jay Doe">
            </div>
            <div v-if="transferMethod === 'bank'" class="mb-3">
                <label for="bank_iban" class="form-label">IBAN</label>
                <input v-model="transferDetails.bank_iban" type="text" :class="['form-control', validateIBAN(transferDetails.bank_iban)]" id="bank_iban" placeholder="NL12 ABCD 1234 5678 90">
            </div>
            <div v-if="transferMethod === 'bank'" class="mb-3">
                <label for="bank_bic" class="form-label">BIC</label>
                <input v-model="transferDetails.bank_bic" type="text" :class="['form-control', validateBIC(transferDetails.bank_bic)]" id="bank_bic" placeholder="BUNQNL2A">
            </div>
            <div v-if="transferMethod === 'paypal'" class="mb-3">
                <label for="paypal_email" class="form-label">Email</label>
                <input v-model="transferDetails.paypal_email" type="email" class="form-control" id="paypal_email" placeholder="paypal-user@email.com">
            </div>
            <div v-if="transferMethod === 'charity'" class="mb-3">
                <label for="charity_name" class="form-label">Charity name</label>
                <input v-model="transferDetails.charity_name" type="text" class="form-control" id="charity_name" placeholder="Trevor Project">
            </div>
            <div v-if="transferMethod === 'charity'" class="mb-3">
                <label for="charity_url" class="form-label">Link</label>
                <input v-model="transferDetails.charity_url" type="email" class="form-control" id="charity_url" placeholder="https://www.thetrevorproject.org/">
            </div>
            <div v-if="transferMethod" class="mb-3">
                <label for="notes" class="form-label">Notes</label>
                <input v-model="transferDetails.notes" type="text" class="form-control" id="notes" placeholder="">
            </div>
        </section>
        <button class="btn btn-primary" :disabled="!transferMethod" @click="save">
            <Icon v="save"/>
            Save
        </button>
    </div>
    </Page>
</template>

<script>
import {head} from "../src/helpers";
import {DateTime} from 'luxon';
import gm from 'avris-generator';

const max = DateTime.now();
const min = DateTime.local(2020, 1, 1);
const closed = DateTime.local(2020, 1, 1); // TODO DateTime.local(2023, 1, 1);

const AREAS = [
    'translation',
    'moderation',
    'content creation',
    'coding',
    'devops',
    'user support',
    'social media',
    'media interviews',
    'design',
    'sensitivity reviews',
    'administration',
    'other',
];
const MONTHS = {
    1: 'Jan',
    2: 'Feb',
    3: 'Mar',
    4: 'Apr',
    5: 'May',
    6: 'Jun',
    7: 'Jul',
    8: 'Aug',
    9: 'Sep',
    10: 'Oct',
    11: 'Nov',
    12: 'Dec',
};
const TRANSFER_METHODS = {
    'bank': 'Bank transfer',
    'paypal': 'PayPal',
    'charity': 'Charity',
    'skip': 'Skip allowance',
};

export default {
    data() {
        return {
            year: max.year,
            min,
            max,
            closed,
            areas: AREAS,
            months: MONTHS,
            transferMethods: TRANSFER_METHODS,

            focusMonth: null,
            focusArea: null,
        }
    },
    async asyncData({ app }) {
        const persistent = await app.$axios.$get(`/admin/timesheet`);

        const timesheet = {};
        for (let y = min.year; y <= max.year; y++) {
            timesheet[y] = {};
            for (let m in MONTHS) {
                if (!MONTHS.hasOwnProperty(m)) { continue; }
                timesheet[y][m] = {};
                for (let area of AREAS) {
                    timesheet[y][m][area] = persistent?.timesheet?.[y]?.[m]?.[area] || 0;
                }
            }
        }

        return {
            moderation: await app.$axios.$get(`/admin/moderation`),
            timesheet: timesheet,
            transferMethod: persistent?.transfer || '',
            transferDetails: {
                bank_name: persistent?.details?.bank_name || '',
                bank_iban: persistent?.details?.bank_iban || '',
                bank_bic: persistent?.details?.bank_bic || '',
                paypal_email: persistent?.details?.paypal_email || '',
                charity_name: persistent?.details?.charity_name || '',
                charity_url: persistent?.details?.charity_url || '',
                notes: persistent?.details?.notes || '',
            },
        };
    },
    methods: {
        dt(year, month) {
            return DateTime.local(parseInt(year), parseInt(month), 1);
        },
        validateIBAN(iban) {
            if (!iban.trim()) {
                return '';
            }
            try {
                gm.validate('_', 'iban', iban);
                return 'is-valid';
            } catch (e) {
                return 'is-invalid';
            }
        },
        validateBIC(bic) {
            if (!bic.trim()) {
                return '';
            }
            return bic.replace(/ /g, '').match(/^[A-Z0-9]{8,11}$/)
                ? 'is-valid'
                : 'is-invalid';
        },
        async save() {
            await this.$post(`/admin/timesheet`, {
                timesheets: {
                    timesheet: this.timesheet,
                    transfer: this.transferMethod,
                    details: this.transferDetails,
                }
            })
            await this.$alert('Saved successfully', 'success');
        },
        cellKeydown(e) {
            let newFocusMonth = this.focusMonth;
            let newFocusArea = this.focusArea;
            switch (e.key) {
                case 'ArrowLeft':
                    newFocusMonth--;
                    break;
                case 'ArrowRight':
                    newFocusMonth++;
                    break;
                case 'ArrowUp':
                    newFocusArea--;
                    break;
                case 'ArrowDown':
                    newFocusArea++;
                    break;
                default:
                    return;
            }
            const $ref = this.$refs[`cell-${newFocusMonth}-${newFocusArea}`];
            if (!$ref || !$ref.length || $ref[0].getAttribute('disabled')) {
                return;
            }
            $ref[0].focus();
            e.preventDefault();
            e.stopPropagation();
        },
        sumCells(area, month) {
            let sum = 0;
            for (let m in this.timesheet[this.year]) {
                if (month !== undefined && parseInt(m) !== parseInt(month)) { continue; }
                for (let a in this.timesheet[this.year][m]) {
                    if (area !== undefined && a !== area) { continue; }
                    sum += this.timesheet[this.year][m][a] || 0;
                }
            }
            return sum;
        },
    },
    watch: {
        year() {
            this.$refs[`cell-1-0`][0].focus();
        },
    },
    head() {
        return head({
            title: this.$t('admin.header') + ' • Volunteering timesheets',
        });
    },
}
</script>
