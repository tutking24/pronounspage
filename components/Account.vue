<template>
    <section>
        <Alert type="danger" :message="error"/>

        <form @submit.prevent="changeUsername">
            <h3 class="h6"><T>user.account.changeUsername.header</T></h3>
            <div class="input-group mb-3">
                <input type="text" class="form-control" v-model="username"
                       required minlength="4" maxlength="16"/>
                <div class="input-group-append">
                    <button class="btn btn-outline-primary">
                        <T>user.account.changeUsername.action</T>
                    </button>
                </div>
            </div>
        </form>

        <div>
            <h3 class="h6"><T>user.account.changeEmail.header</T></h3>
            <p>{{ email }}</p>
        </div>

        <p v-if="$user().roles === 'admin'">
            <span class="badge badge-primary"><T>user.account.admin</T></span>
        </p>

        <button class="btn btn-outline-secondary btn-sm" @click="logout">
            <Icon v="sign-out"/>
            <T>user.logout</T>
        </button>
    </section>
</template>

<script>
    export default {
        data() {
            return {
                username: this.$user().username,
                email: this.$user().email,

                error: '',
            };
        },
        methods: {
            async changeUsername() {
                await this.post(`/user/change-username`, {
                    username: this.username
                }, {
                    headers: {...this.$auth()},
                });
            },
            async post(url, data, options = {}) {
                this.error = '';

                const response = await this.$axios.$post(url, data, options);

                if (response.error) {
                    this.error = response.error;
                    return;
                }

                this.$store.commit('setToken', response.token);
                this.$cookies.set('token', this.$store.state.token);
            },
            logout() {
                this.$store.commit('setToken', null);
                this.$cookies.removeAll();
            }
        },
    }
</script>
