<template>
    <Page wide>
    <NotFound v-if="!$isGranted('panel')"/>
    <div v-else>
        <p class="d-flex justify-content-between">
            <nuxt-link to="/admin">
                <Icon v="user-cog"/>
                <T>admin.header</T>
            </nuxt-link>
            <nuxt-link to="/admin/timesheets">
                <Icon v="file-spreadsheet"/>
                Fill out yours
            </nuxt-link>
        </p>        <h2>
            <Icon v="file-spreadsheet"/>
            Timesheets overview
        </h2>
        <div class="row my-4">
            <ul class="list-inline">
                <li class="list-inline-item">Period:</li>
                <li v-for="(_, period) in PERIODS" class="list-inline-item">
                    <a href="#" @click.prevent="setPeriod(period)" class="btn btn-outline-primary">{{period}}</a>
                </li>
            </ul>
            <div class="input-group mb-3">
                <span class="input-group-text">Start:</span>
                <select v-model.number="startYear" class="form-control">
                    <option v-for="year in years" :value="year">{{year}}</option>
                </select>
                <select v-model.number="startMonth" class="form-control">
                    <option v-for="(month, m) in MONTHS" :value="m">{{month}}</option>
                </select>
                <span class="input-group-text">End:</span>
                <select v-model.number="endYear" class="form-control">
                    <option v-for="year in years" :value="year">{{year}}</option>
                </select>
                <select v-model.number="endMonth" class="form-control">
                    <option v-for="(month, m) in MONTHS" :value="m">{{month}}</option>
                </select>
            </div>
        </div>
        <table class="table table-striped">
            <thead>
            <tr>
                <th>Username</th>
                <th>Hours</th>
                <th>Percentage</th>
                <th>Transfer info</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(hours, username) in hoursSummary">
                <th><LocaleLink locale="_" :link="`/@${username}`">@{{username}}</LocaleLink></th>
                <td>{{ hours }}</td>
                <td>{{ hoursSum && timesheets[username].transfer !== 'skip' ? ((100 * hours / hoursSum).toFixed(1) + '%') : '—'}}</td>
                <td>
                    <p><strong>{{timesheets[username].transfer}}</strong></p>
                    <ul v-if="timesheets[username]">
                        <li v-for="(value, key) in timesheets[username].details" v-if="value">
                            <strong>{{ key }}:</strong> {{ value }}
                        </li>
                    </ul>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
    </Page>
</template>

<script>
import {head} from "../src/helpers";
import {DateTime} from 'luxon';
import {min, max, MONTHS, PERIODS} from '../src/timesheets';

function* range(start, end) {
    for (let i = start; i <= end; i++) {
        yield i;
    }
}

export default {
    data() {
        const period = '2020-2022';
        const [startYear, startMonth, endYear, endMonth] = PERIODS[period];
        return {
            PERIODS,
            MONTHS,
            startYear, startMonth, endYear, endMonth,
            years: [...range(min.year, max.year)],
        }
    },
    async asyncData({ app }) {
        return {
            timesheets: await app.$axios.$get(`/admin/timesheets`),
        }
    },
    methods: {
        setPeriod(period) {
            [this.startYear, this.startMonth, this.endYear, this.endMonth] = PERIODS[period];
        },
        isInRange(year, month) {
            const x = DateTime.local(year, month, 15);
            return x >= DateTime.local(this.startYear, this.startMonth, 1) && x <= DateTime.local(this.endYear, this.endMonth, 30);
        }
    },
    computed: {
        hoursSummary() {
            const hoursSummary = {};
            for (let username in this.timesheets) {
                if (!this.timesheets.hasOwnProperty(username)) { continue; }
                let hours = 0;
                const timesheet = this.timesheets[username].timesheet;
                for (let year in timesheet) {
                    if (!timesheet.hasOwnProperty(year)) { continue; }
                    for (let month in timesheet[year]) {
                        if (!timesheet[year].hasOwnProperty(month)) { continue; }
                        if (!this.isInRange(parseInt(year), parseInt(month))) { continue; }
                        for (let h of Object.values(timesheet[year][month])) {
                            hours += h;
                        }
                    }
                }
                if (hours > 0) {
                    hoursSummary[username] = hours;
                }
            }
            return hoursSummary;
        },
        hoursSum() {
            let sum = 0;
            for (let username in this.hoursSummary) {
                if (!this.hoursSummary.hasOwnProperty(username) || this.timesheets[username].transfer === 'skip') { continue; }
                sum += this.hoursSummary[username];
            }
            return sum;
        },
    },
    head() {
        return head({
            title: this.$t('admin.header') + ' • Timesheets overview',
        });
    },
}
</script>
