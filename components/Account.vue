<template>
    <section>
        <div class="card mb-3">
            <div class="card-body d-flex flex-column flex-md-row">
                <div class="mx-2 text-center d-flex flex-row flex-md-column">
                    <p>
                        <Avatar :user="$user()"/>
                    </p>
                    <p class="text-center flex-grow-1">
                        <a href="https://gravatar.com" target="_blank" rel="noopener" class="small">
                            <T>user.avatar.change</T>
                            <br/>
                            Gravatar.com
                        </a>
                    </p>
                </div>
                <div class="mx-2 flex-grow-1">
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

                    <p v-if="$admin()">
                        <span class="badge badge-primary"><T>user.account.admin</T></span>
                    </p>
                </div>
            </div>
        </div>

        <p>
            <button class="btn btn-outline-secondary btn-sm" @click="logout">
                <Icon v="sign-out"/>
                <T>user.logout</T>
            </button>
        </p>
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
                }, { headers: this.$auth() });
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
            },
        },
    }
</script>
