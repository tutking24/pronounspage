<template>
    <section>
        <div class="card mb-3">
            <div class="card-body d-flex flex-column flex-md-row">
                <div class="mx-2 text-center">
                    <p class="mb-0">
                        <Avatar :user="$user()"/>
                    </p>
                    <div class="mb-2">
                        <div v-if="$user().avatarSource === 'gravatar'" class="mt-3">
                            <a href="https://gravatar.com" target="_blank" rel="noopener" class="small">
                                <Icon v="external-link"/>
                                <T>user.avatar.change</T>
                                Gravatar
                            </a>
                        </div>
                        <div v-else class="mt-3">
                            Gravatar:
                            <a href="#" @click.prevent="setAvatar('gravatar')">
                                <Avatar :user="$user()" :src="gravatar($user())" dsize="2rem"/>
                            </a>
                        </div>
                        <div v-if="$user().avatarSource">
                            <a href="#" @click.prevent="setAvatar(null)" class="small">
                                <Icon v="trash"/>
                                <T>crud.remove</T>
                            </a>
                        </div>
                        <ImageUploader small @uploaded="uploaded"/>
                    </div>
                    <p v-if="$isGranted('panel') || $isGranted('users')">
                        <nuxt-link to="/admin" class="badge bg-primary text-white"><T>user.account.admin</T></nuxt-link>
                    </p>
                </div>
                <div class="mx-2 flex-grow-1">
                    <Alert type="danger" :message="error"/>

                    <div v-if="message" class="alert alert-success">
                        <p class="mb-0 narrow-message">
                            <Icon :v="messageIcon"/>
                            <T>{{message}}</T>
                        </p>
                    </div>

                    <form @submit.prevent="changeUsername" :disabled="savingUsername">
                        <h3 class="h6"><T>user.account.changeUsername.header</T></h3>
                        <div class="input-group mb-3">
                            <input type="text" class="form-control" v-model="username"
                                   required minlength="4" maxlength="16"/>
                            <button class="btn btn-outline-primary">
                                <T>user.account.changeUsername.action</T>
                            </button>
                        </div>
                    </form>

                    <form @submit.prevent="changeEmail" :disabled="savingEmail">
                        <h3 class="h6"><T>user.account.changeEmail.header</T></h3>
                        <div v-if="!changeEmailAuthId" class="input-group mb-3">
                            <input type="email" class="form-control" v-model="email" required/>
                            <button class="btn btn-outline-primary">
                                <T>user.account.changeEmail.action</T>
                            </button>
                        </div>
                        <div v-else class="input-group mb-3">
                            <input type="text" class="form-control text-center" v-model="code"
                                   placeholder="000000" autofocus required minlength="0" maxlength="6"
                                   inputmode="numeric" pattern="[0-9]{6}" autocomplete="one-time-code"
                                   ref="code"
                            />
                            <button class="btn btn-outline-primary">
                                <Icon v="key"/>
                                <T>user.code.action</T>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <Loading :value="profiles">
            <template v-slot:header>
                <h3 class="h4"><T>profile.list</T>:</h3>
            </template>
            <ul v-if="profiles !== undefined" class="list-group">
                <li v-for="(options, locale) in locales" :key="locale" :class="['list-group-item', locale === config.locale ? 'profile-current' : '']">
                    <ProfileOverview :profile="profiles[locale]" :locale="locale" @update="setProfiles"/>
                </li>
            </ul>
        </Loading>

        <Loading :value="socialConnections">
            <template v-slot:header>
                <h3 class="h4"><T>user.socialConnection.list</T>:</h3>
            </template>
            <ul v-if="socialConnections !== undefined" class="list-group">
                <li v-for="(providerOptions, provider) in socialProviders" :key="provider" :class="['list-group-item', socialConnections[provider] !== undefined ? 'profile-current' : '']">
                    <SocialConnection :provider="provider" :providerOptions="providerOptions" :connection="socialConnections[provider]"
                                      @disconnected="socialConnections[provider] = undefined" @setAvatar="setAvatar"/>
                </li>
            </ul>
        </Loading>

        <section>
            <a href="#" class="badge bg-light text-dark border" @click.prevent="logout">
                <Icon v="sign-out"/>
                <T>user.logout</T>
            </a>

            <a href="#" class="badge bg-light text-dark border" @click.prevent="deleteAccount">
                <Icon v="trash-alt"/>
                <T>user.deleteAccount</T>
            </a>
        </section>
    </section>
</template>

<script>
    import {socialProviders} from "../src/data";
    import {gravatar} from "../src/helpers";
    import cookieSettings from "../src/cookieSettings";

    export default {
        data() {
            return {
                username: this.$user().username,
                email: this.$user().email,

                message: '',
                messageIcon: null,
                error: '',
                changeEmailAuthId: null,
                code: '',

                profiles: undefined,

                socialProviders,
                socialConnections: undefined,

                savingUsername: false,
                savingEmail: false,

                gravatar,
            }
        },
        async mounted() {
            this.profiles = await this.$axios.$get(`/profile/get/${this.$user().username}`);
            this.socialConnections = await this.$axios.$get(`/user/social-connections`);

            if (process.client) {
                const redirectTo = window.sessionStorage.getItem('after-login');
                if (this.$user() && redirectTo) {
                    window.sessionStorage.removeItem('after-login')
                    await this.$router.push(redirectTo);
                }
            }
        },
        methods: {
            async changeUsername() {
                this.error = '';

                if (this.savingUsername) { return; }
                this.savingUsername = true;
                try {
                    const response = await this.$post(`/user/change-username`, {
                        username: this.username,
                    });

                    if (response.error) {
                        this.error = response.error;
                        return;
                    }

                    this.$store.commit('setToken', response.token);
                    this.$cookies.set('token', this.$store.state.token, cookieSettings);
                    this.message = 'crud.saved';
                    this.messageIcon = 'check-circle';
                    setTimeout(() => this.message = '', 3000);
                } finally {
                    this.savingUsername = false;
                }
            },
            async changeEmail() {
                this.error = '';

                if (this.savingEmail) { return; }
                this.savingEmail = true;
                try {
                    const response = await this.$post(`/user/change-email`, {
                        email: this.email,
                        authId: this.changeEmailAuthId,
                        code: this.code,
                    });

                    if (response.error) {
                        this.error = response.error;
                        return;
                    }

                    if (!this.changeEmailAuthId) {
                        this.changeEmailAuthId = response.authId;
                        this.message = 'user.login.emailSent';
                        this.messageIcon = 'envelope-open-text';
                        this.$nextTick(_ => {
                            this.$refs.code.focus();
                        });
                    } else {
                        this.changeEmailAuthId = null;
                        this.message = '';
                        this.code = null;

                        this.$store.commit('setToken', response.token);
                        this.$cookies.set('token', this.$store.state.token, cookieSettings);
                        this.message = 'crud.saved';
                        this.messageIcon = 'check-circle';
                        setTimeout(() => this.message = '', 3000);
                    }
                } finally {
                    this.savingEmail = false;
                }
            },
            logout() {
                this.$store.commit('setToken', null);
                this.$cookies.removeAll();
            },
            setProfiles(profiles) {
                this.profiles = profiles;
            },
            async deleteAccount() {
                await this.$confirm(this.$t('user.deleteAccountConfirm'), 'danger');

                const response = await this.$post(`/user/delete`);
                this.logout();
            },
            async setAvatar(source) {
                const response = await this.$post(`/user/set-avatar`, {source});

                this.$store.commit('setToken', response.token);
                this.$cookies.set('token', this.$store.state.token, cookieSettings);
            },
            async uploaded(ids) {
                await this.setAvatar(`${process.env.BUCKET}/images/${ids[0]}-thumb.png`);
            },
        },
    }
</script>

<style lang="scss" scoped>
    @import "assets/variables";

    .profile-current {
        border-inline-start: 3px solid $primary;
    }

    .narrow-message {
        max-width: 56ch;
    }
</style>
