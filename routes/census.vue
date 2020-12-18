<template>
    <div>
        <h2>
            <Icon v="user-chart"/>
            <T>census.headerLong</T>
        </h2>

        <template v-if="q === null">
            <section>
                <T :params='{
                    questions: questions.length,
                    start: config.census.start,
                    end: config.census.end,
                }'>census.description</T>
            </section>

            <section>
                <Share :title="$t('census.headerLong')"/>
            </section>

            <section v-if="config.census.open">
                <div v-if="finished" class="alert alert-success">
                    <Icon v="badge-check"/>
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
                        <button class="btn btn-primary btn-lg" :disabled="!agreement" @click="start">
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
            <p class="h4">{{q+1}}. {{question.question}}</p>
            <form>
                <div v-if="question.type === 'radio'" class="form-group">
                    <div class="form-check" v-for="option in question.options">
                        <label class="form-check-label small">
                            <input type="radio" class="form-check-input" v-model="answers[q]" :name="'question' + q" :value="option" required/>
                            {{option}}
                        </label>
                    </div>
                </div>
                <div v-else-if="question.type === 'checkbox'" class="form-group">
                    <div class="form-check" v-for="option in question.options">
                        <label class="form-check-label small">
                            <input type="checkbox" class="form-check-input" v-model="answers[q]" :value="option"/>
                            {{option}}
                        </label>
                    </div>
                </div>
                <div v-else-if="question.type === 'etxt'" class="form-group">
                    <input type="text" class="form-control" v-model="answers[q]" required/>
                </div>
                <div v-else-if="question.type === 'number'" class="form-group">
                    <input type="number" class="form-control" :min="question.min" :max="question.max" v-model="answers[q]" required/>
                </div>

                <div v-if="question.writein" class="form-group">
                    <input type="text" class="form-control form-control-sm" v-model="writins[q]"/>
                </div>
            </form>

            <div class="btn-group btn-block">
                <button class="btn btn-outline-primary" :disabled="q === 0" @click="q--">
                    <Icon v="arrow-alt-left"/>
                    <T>census.prev</T>
                </button>
                <button class="btn btn-primary" :disabled="!stepValid" @click="q++">
                    <T>census.next</T>
                    <Icon v="arrow-alt-right"/>
                </button>
            </div>
        </template>

        <template v-else>
            <div class="alert alert-success">
                <Icon v="badge-check"/>
                <T>census.finished</T>
            </div>
        </template>
    </div>
</template>

<script>
    import {buildDict, head, shuffle} from "../src/helpers";

    export default {
        data() {
            const questions = this.config.census.questions.map(q => {
                if (q.randomise) {
                    q.options = shuffle(q.options);
                }
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
            }
        },
        async asyncData({ app, store }) {
            const finished = await app.$axios.$get(`/census/finished`);

            return {
                finished,
            };
        },
        methods: {
            start() {
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
                if (this.question.type === 'radio') {
                    return this.answers[this.q] !== undefined;
                }
                if (this.question.type === 'checkbox') {
                    return this.answers[this.q] !== undefined && this.answers[this.q].length > 0;
                }
                if (this.question.type === 'number') {
                    const v = parseInt(this.answers[this.q]);
                    return this.answers[this.q] !== '' && v >= this.question.min && v <= this.question.max;
                }
                if (this.question.type === 'text') {
                    return this.answers[this.q] !== '';
                }
                return true;
            }
        },
        watch: {
            async q() {
                if (this.q === this.questions.length) {
                    await this.$axios.$post(`/census/submit`, {
                        answers: JSON.stringify(this.answers),
                        writins: JSON.stringify(this.writins),
                    });
                    this.finished = true;
                }
            },
        },
        head() {
            return head({
                title: this.$t('census.headerLong'),
            });
        },
    };
</script>
