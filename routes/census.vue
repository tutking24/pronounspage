<template>
    <Page>
        <CommunityNav/>

        <h2>
            <Icon v="user-chart"/>
            <T>census.headerLong</T>
        </h2>

        <template v-if="q === null">
            <section v-if="$isGranted('census')">
                <div class="alert alert-info">
                    <a href="/api/census/export" class="btn btn-outline-secondary btn-sm float-end">
                        <Icon v="download"/>
                    </a>

                    <p>{{countResponses.all}} <T>census.replies</T></p>
                    <ul>
                        <li>{{countResponses.nonbinary}} <T>census.repliesNonbinary</T></li>
                        <li>{{countResponses.usable}} <T>census.repliesUsable</T></li>
                        <li><nuxt-link :to="`/${config.census.route}/admin`">{{countResponses.awaiting}} <T>census.repliesAwaiting</T></nuxt-link></li>
                    </ul>
                    <ChartSet name="useful responses" :data="countResponses.graphs" init="cumulative" class="mb-3"/>
                </div>
            </section>

            <section class="row">
                <div class="col-12 col-lg-6">
                    <T>census.description</T>
                    <T v-if="open" :params='{
                        questions: questions.length,
                        start: start.setLocale(config.locale).toLocaleString(DateTime.DATE_SHORT),
                        end: end.setLocale(config.locale).toLocaleString(DateTime.DATE_SHORT),
                    }'>census.descriptionOpen</T>
                    <T v-else>census.descriptionClosed</T>
                </div>
                <div class="col-12 col-lg-6">
                    <div v-if="Object.keys(config.census.results).length > 0" class="alert alert-info">
                        <ul class="list-unstyled mb-0">
                            <li v-for="(text, link) in config.census.results" class="h5 m-3">
                                <router-link :to="`/blog/${link}`">
                                    <Icon v="file-chart-line"/>
                                    {{text}}
                                </router-link>
                            </li>
                        </ul>
                    </div>
                    <CensusShare :text="$t('census.headerLong')"/>
                    <CensusSubscribe/>
                </div>
            </section>


            <section v-if="open">
                <div v-if="finished" class="alert alert-success">
                    <Icon v="badge-check" size="2" class="float-start me-2 mt-2"/>
                    <T>census.finished</T>
                </div>
                <template v-else>
                    <div class="form-group">
                        <div class="form-check">
                            <label class="form-check-label small">
                                <input type="checkbox" class="form-check-input" v-model="agreement">
                                <T>census.agree</T>
                            </label>
                        </div>
                    </div>
                    <div class="form-group">
                        <button class="btn btn-primary btn-lg" :disabled="!agreement" @click="startSurvey">
                            <T>census.start</T>
                        </button>
                    </div>
                </template>
            </section>
        </template>

        <template v-else-if="q < questions.length">
            <div class="progress my-3">
                <div class="progress-bar" role="progressbar" :style="`width: ${progress}%`" :aria-valuenow="q" aria-valuemin="0" :aria-valuemax="questions.length">
                    {{q}}/{{questions.length}}
                </div>
            </div>
            <p class="h4 mt-5 mb-3">{{q+1}}. {{question.question}}</p>
            <div v-if="question.instruction" class="alert alert-info small">
                <p v-for="(line, i) in question.instruction" :class="i === question.instruction.length - 1 ? 'mb-0' : ''">
                    <LinkedText :text="line"/>
                </p>
            </div>
            <form @submit.prevent="q++" ref="questionform">
                <div v-if="question.type === 'radio'" :class="['form-group', question.optionsSorted.length > 10 ? 'multi-column' : '']">
                    <div class="form-check mb-2" v-for="[option, help] in question.optionsSorted">
                        <label class="form-check-label small">
                            <input type="radio" class="form-check-input" v-model="answers[q]" :name="'question' + q" :value="option" required/>
                            {{option}}
                            <span v-if="help" class="text-muted">({{help}})</span>
                        </label>
                    </div>
                </div>
                <div v-else-if="question.type === 'checkbox'" :class="['form-group', question.optionsSorted.length > 10 ? 'multi-column' : '']">
                    <div class="form-check mb-2" v-for="[option, help] in question.optionsSorted">
                        <label class="form-check-label small">
                            <input type="checkbox" class="form-check-input" v-model="answers[q]" :value="option"/>
                            {{option}}
                            <span v-if="help" class="text-muted">({{help}})</span>
                        </label>
                    </div>
                </div>
                <div v-else-if="question.type === 'text'" class="form-group">
                    <input type="text" class="form-control" v-model="answers[q]" required/>
                </div>
                <div v-else-if="question.type === 'number'" class="form-group">
                    <input type="number" class="form-control" :min="question.min" :max="question.max" v-model="answers[q]" required/>
                </div>
                <div v-else-if="question.type === 'textarea'" class="form-group">
                    <textarea class="form-control" v-model="answers[q]"/>
                </div>

                <div v-if="question.writein" class="form-group">
                    <input type="text" class="form-control form-control-sm" v-model="writins[q]" :placeholder="$t('census.writein')"/>
                </div>
            </form>

            <div class="btn-group w-100">
                <button class="btn btn-outline-primary" :disabled="q === 0" @click="q--">
                    <Icon v="arrow-alt-left"/>
                    <T>census.prev</T>
                </button>
                <button class="btn btn-primary" :disabled="!stepValid" @click="q++">
                    <T>census.next</T>
                    <Icon v="arrow-alt-right"/>
                </button>
            </div>

            <div v-if="$user() && $user().username === 'andrea'" class="mt-4 btn-group w-100">
                <button v-for="(question, i) in questions" :class="['btn', q === i ? 'btn-primary' : 'btn-outline-primary']" :disabled="q === i" @click="q = i">
                    {{i}}
                </button>
            </div>
        </template>

        <template v-else>
            <div class="progress my-3">
                <div class="progress-bar" role="progressbar" :style="`width: ${progress}%`" :aria-valuenow="q" aria-valuemin="0" :aria-valuemax="questions.length">
                    {{q}}/{{questions.length}}
                </div>
            </div>
            <section>
                <div class="alert alert-success">
                    <Icon v="badge-check" size="2" class="float-start me-2 mt-2"/>
                    <T>census.finished</T>
                </div>
            </section>
            <section class="row">
                <div class="col-12 col-lg-6">
                    <CensusShare :text="$t('census.shareButton')"/>
                </div>
                <div class="col-12 col-lg-6">
                    <CensusSubscribe/>
                </div>
            </section>
        </template>
    </Page>
</template>

<script>
    import {buildDict, head, shuffle} from "../src/helpers";
    import {DateTime} from "luxon";

    export default {
        data() {
            const questions = this.config.census.questions.map(q => {
                q.optionsSorted = q.randomise
                     ? [
                        ...(q.optionsFirst || []),
                        ...shuffle(q.options),
                        ...(q.optionsLast || []),
                    ]
                    : q.options;
                return q;
            });
            return {
                agreement: false,
                q: null,
                questions,
                answers: buildDict(function* () {
                    let i = 0;
                    for (let question of questions) {
                        yield [i, question.type === 'checkbox' ? [] : null]
                        i++;
                    }
                }),
                writins: buildDict(function* () {
                    let i = 0;
                    for (let question of questions) {
                        yield [i, '']
                        i++;
                    }
                }),
                DateTime,
            }
        },
        async asyncData({ app, store }) {
            const finished = await app.$axios.$get(`/census/finished`);
            const countResponses = await app.$axios.$get(`/census/count`);

            return {
                finished,
                countResponses,
            };
        },
        mounted() {
            if (process.client && !this.$user()) {
                this.finished = parseInt(window.localStorage.getItem(`census-${this.config.census.edition}-finished`) || 0) === parseInt(this.config.census.edition);
            }
        },
        methods: {
            startSurvey() {
                this.q = 0;
            }
        },
        computed: {
            progress() {
                return Math.round(100 * (this.q || 0) / this.questions.length);
            },
            question() {
                return this.questions[this.q];
            },
            stepValid() {
                if (!this.question) {
                    return false;
                }
                if (this.writins[this.q] !== '') {
                    return true;
                }
                if (this.question.optional) {
                    return true;
                }
                if (this.question.type === 'radio') {
                    return this.answers[this.q] !== undefined && this.answers[this.q] !== null;
                }
                if (this.question.type === 'checkbox') {
                    return this.answers[this.q] !== undefined && this.answers[this.q].length > 0;
                }
                if (this.question.type === 'number') {
                    const v = parseInt(this.answers[this.q]);
                    return this.answers[this.q] !== '' && v >= this.question.min && v <= this.question.max;
                }
                if (this.question.type === 'text' || this.question.type === 'textarea') {
                    return this.answers[this.q] !== '';
                }
                return true;
            },
            start() {
                return DateTime.fromISO(this.config.census.start).toLocal();
            },
            end() {
                return DateTime.fromISO(this.config.census.end).toLocal();
            },
            open() {
                const now = DateTime.utc().setZone(this.config.format.timezone);
                return now >= this.start && now <= this.end;
            },
        },
        watch: {
            async q(newValue, oldValue) {
                if (this.question && this.question.conditionalOn) {
                    if (this.answers[this.question.conditionalOn].filter(a => this.question.conditionalValue.includes(a)).length === 0) {
                        if (newValue > oldValue) {
                            this.q++;
                        } else {
                            this.q--;
                        }
                        return;
                    }
                }

                if (this.q === this.questions.length) {
                    await this.$post(`/census/submit`, {
                        answers: JSON.stringify(this.answers),
                        writins: JSON.stringify(this.writins),
                    });
                    this.finished = true;
                    window.localStorage.setItem(`census-${this.config.census.edition}-finished`, this.config.census.edition + '');
                }
                this.$nextTick(() => {
                    if (this.$refs.questionform) {
                        this.$refs.questionform.querySelector('input,textarea').focus();
                    }
                });
            },
        },
        async beforeRouteLeave (to, from, next) {
            if (this.q !== null && this.q < this.questions.length) {
                try {
                    await this.$confirm(this.$t('census.leave'));
                } catch {
                    next(false);
                    return;
                }
            }

            next();
        },
        head() {
            return head({
                title: this.$t('census.headerLong'),
                description: this.$t('census.description')[0],
                banner: 'img-local/census/census-banner.png',
            });
        },
    };
</script>

<style lang="scss">
    @import "../assets/style";

    .multi-column {
        columns: 2;
    }
    @include media-breakpoint-up('md', $grid-breakpoints) {
        .multi-column {
            columns: 3;
        }
    }
</style>
