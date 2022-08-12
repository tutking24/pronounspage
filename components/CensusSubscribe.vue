<template>
    <div class="alert alert-light border">
        <p><T>census.subscribe.encouragement</T></p>

        <form @submit.prevent="subscribe">
            <div v-if="saving" class="text-center">
                <Spinner/>
            </div>
            <div v-else-if="subscribed" class="text-success">
                <Icon v="badge-check"/>
                <T>census.subscribe.success</T>
            </div>
            <div v-else class="input-group" >
                <input type="email" class="form-control" placeholder="you@example.com" v-model="email"/>
                <button class="btn btn-outline-primary" type="submit">
                    <Icon v="mailbox"/>
                    <T>census.subscribe.action</T>
                </button>
            </div>
        </form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            email: '',
            saving: false,
            subscribed: false,
        }
    },
    methods: {
        async subscribe() {
            this.saving = true;
            try {
                await this.$post('/subscription/subscribe', {
                    type: 'census',
                    email: this.email,
                })
                this.subscribed = true;
            } finally {
                this.saving = false;
            }
        },
    },
}
</script>
