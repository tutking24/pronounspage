<template>
    <section>
        <div class="card mb-3">
            <div class="card-body d-flex flex-column flex-md-row">
                <div class="mx-2 text-center">
                    <p class="mb-0">
                        <Avatar :user="$user()"/>
                    </p>
                    <p>
                        <a href="https://gravatar.com" target="_blank" rel="noopener" class="small">
                            <Icon v="external-link"/>
                            <T>user.avatar.change</T>
                        </a>
                    </p>
                    <p v-if="$admin()">
                        <span class="badge badge-primary"><T>user.account.admin</T></span>
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
                </div>
            </div>
        </div>

        <Loading :value="profiles"><template v-if="profiles !== undefined">
            <h3 class="h4"><T>profile.list</T>:</h3>
            <ul class="list-group mb-3">
                <li v-for="(options, locale) in locales" :key="locale" :class="['list-group-item', locale === config.locale ? 'profile-current' : '']">
                    <ProfileOverview :profile="profiles[locale]" :locale="locale"/>
                </li>
            </ul>
        </template></Loading>

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

                profiles: undefined,
            }
        },
        async mounted() {
            this.profiles = await this.$axios.$get(`/profile/get/${this.$user().username}`);
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

<style lang="scss" scoped>
    @import "assets/style";

    .profile-current {
        border-left: 3px solid $primary;
    }
</style>
