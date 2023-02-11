<template>
    <Page>
    <div v-if="$isGranted('census')">
        <CommunityNav/>

        <h2>
            <Icon v="user-chart"/>
            <T>census.headerLong</T>
        </h2>

        <Spinner v-if="queue === undefined" size="5rem"/>
        <div v-else-if="queue.count === 0" class="alert alert-success text-center">
            <Icon v="check-circle" size="5"/>
            <p><T>census.moderation.done</T></p>
        </div>
        <div v-else>
            <div class="alert alert-info">
                <p>{{queue.count}} <T>census.repliesAwaiting</T></p>
                <label class="form-check form-switch d-inline-block">
                    <input class="form-check-input" type="checkbox" role="switch" v-model="hideEmpty">
                    Hide answers with no write-ins
                </label>
            </div>

            <ol>
                <li v-for="(question, i) in config.census.questions" :key="i" v-if="!hideEmpty || queue.next.writins[i.toString()] || (queue.next.answers[i.toString()] && question.type === 'textarea')">
                    <p>{{question.question}}</p>
                    <p v-if="queue.next.answers[i.toString()]" :class="question.type === 'textarea' ? 'bg-primary text-white p-2 rounded' : ''"><strong>{{queue.next.answers[i.toString()]}}</strong></p>
                    <p v-if="queue.next.writins[i.toString()]" class="bg-primary text-white p-2 rounded"><strong><em>{{queue.next.writins[i.toString()]}}</em></strong></p>
                </li>
            </ol>

            <div class="d-flex my-5">
                <button class="btn btn-danger flex-grow-1 m-2" @click="decide(true)"><T>census.moderation.troll</T></button>
                <button class="btn btn-outline-primary flex-grow-1 m-2" @click="skip()"><T>census.moderation.skip</T></button>
                <button class="btn btn-success flex-grow-1 m-2" @click="decide(false)"><T>census.moderation.ok</T></button>
            </div>
        </div>
    </div>
    <NotFound v-else/>
    </Page>
</template>

<script>
    export default {
        data() {
            return {
                queue: undefined,
                hideEmpty: false,
            }
        },
        async mounted() {
            await this.fetch();
        },
        methods: {
            async fetch() {
                this.queue = await this.$axios.$get('/census/moderation/queue');
                if (this.queue.next) {
                    this.queue.next.answers = JSON.parse(this.queue.next.answers);
                    this.queue.next.writins = JSON.parse(this.queue.next.writins);
                }
            },
            async decide(decision) {
                const id = this.queue.next.id;
                this.queue = undefined;
                await this.$post('/census/moderation/decide', {
                    id,
                    decision: decision ? 1 : 0,
                })
                await this.fetch();
                window.scrollTo(0, 0);
            },
            async skip() {
                this.queue = undefined;
                await this.fetch();
                window.scrollTo(0, 0);
            }
        }
    };
</script>
