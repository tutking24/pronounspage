<template>
    <section v-if="logoutInProgress">
        <p class="text-center">
            <Spinner size="5rem"/>
        </p>
        <div>
            <iframe v-for="domain in universalDomains"
                    :src="`${domain}/api/user/logout-universal`"
                    style="width: 1px; height: 1px; opacity: .01"
            >
            </iframe>
        </div>
    </section>
    <section v-else>
        <ul class="list-group">
            <li class="list-group-item profile-current">
                <div v-if="changeEmailShown === false" class="d-flex flex-column flex-md-row justify-content-between align-items-center">
                    <span class="my-2">
                        <img src="../node_modules/@fortawesome/fontawesome-pro/svgs/solid/envelope.svg" class="icon invertible"/>
                        <T>user.account.changeEmail.header</T>
                    </span>
                    <span>
                        {{ email }}
                        <a href="#" class="badge bg-light text-dark border" @click.prevent="changeEmailShown = true">
                            <Icon v="pencil"/>
                            <T>user.account.changeEmail.action</T>
                        </a>
                    </span>
                </div>
                <template v-else>
                    <form @submit.prevent="changeEmail" :disabled="savingEmail">
                        <h3 class="h6 my-2">
                            <img src="../node_modules/@fortawesome/fontawesome-pro/svgs/solid/envelope.svg" class="icon invertible"/>
                            <T>user.account.changeEmail.header</T>
                        </h3>
                        <div v-if="!changeEmailAuthId" class="">
                            <input type="email" class="form-control mb-3" v-model="email" required/>
                            <div class="d-flex flex-column flex-md-row">
                                <Captcha v-model="captchaToken"/>
                                <div class="d-none d-md-block ms-3">
                                    <button class="btn btn-outline-primary" :disabled="!canChangeEmail">
                                        <T>user.account.changeEmail.action</T>
                                    </button>
                                </div>
                                <div class="d-block d-md-none mt-3">
                                    <button class="btn btn-outline-primary w-100" :disabled="!canChangeEmail">
                                        <T>user.account.changeEmail.action</T>
                                    </button>
                                </div>
                            </div>
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

                    <Alert type="danger" :message="error"/>

                    <div v-if="message" class="alert alert-success">
                        <p class="mb-0">
                            <Icon :v="messageIcon"/>
                            <T>{{message}}</T>
                        </p>
                    </div>
                </template>
            </li>
            <li v-if="socialConnections === undefined" class="list-group-item text-center">
                <Spinner size="5rem"/>
            </li>
            <template v-else>
                <li v-for="(providerOptions, provider) in socialProviders" :key="provider" :class="['list-group-item', socialConnections[provider] !== undefined ? 'profile-current' : '']">
                    <SocialConnection :provider="provider" :providerOptions="providerOptions" :connection="socialConnections[provider]"
                                      @disconnected="socialConnections[provider] = undefined" @setAvatar="setAvatar"/>
                </li>
            </template>
        </ul>

        <Loading :value="usernames">
            <template v-slot:header>
                <h3 class="h4"><T>profile.list</T></h3>
                <small>
                    <T>user.usernames.limit</T>
                </small>
            </template>
            <template v-if="usernames !== undefined">
                <ul class="nav nav-tabs">
                    <li v-for="(username, key) in usernames" class="nav-item">
                        <button :class="['nav-link', key === selectedUsername ? 'active' : '']" @click="selectedUsername = key">
                            <Avatar :src="username.avatar" dsize="1.8rem"/>
                            {{ username.username }}
                        </button>
                    </li>
                    <li class="nav-item">
                        <button :class="['nav-link', selectedUsername === null ? 'active' : '']" style="height: 2.95rem" @click="selectedUsername = null">
                            <Icon v="plus-circle"/>
                        </button>
                    </li>
                </ul>
                <UsernameProfiles
                        v-for="(username, key) in usernames"
                        v-show="selectedUsername === key"
                        :id="key"
                        :username="username"
                />
            </template>
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

        <div>
            <iframe v-for="domain in universalDomains"
                    :src="`${domain}/api/user/init-universal/${$cookies.get('token')}`"
                    style="width: 1px; height: 1px; opacity: .01"
            >
            </iframe>
        </div>
    </section>
</template>

<script>
    import {socialProviders} from "../src/data";
    import {gravatar} from "../src/helpers";
    import cookieSettings from "../src/cookieSettings";
    import {mapState} from "vuex";

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
                changeEmailShown: false,

                gravatar,

                captchaToken: null,

                universalDomains: process.env.ALL_LOCALES_URLS.split(',').filter(x => x !== process.env.BASE_URL),

                logoutInProgress: false,

                selectedUsername: null,
            }
        },
        async mounted() {
            this.usernames = (await this.$axios.$get(`/profile/get-all/${this.$user().id}`)).usernames;
            this.selectedUsername = Object.keys(this.usernames).length > 0
                ? Object.keys(this.usernames)[0]
                : null;
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
            async changeEmail() {
                this.error = '';

                if (this.savingEmail) { return; }
                this.savingEmail = true;
                try {
                    const response = await this.$post(`/user/change-email`, {
                        email: this.email,
                        authId: this.changeEmailAuthId,
                        code: this.code,
                        captchaToken: this.captchaToken,
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
                this.logoutInProgress = true;
                setTimeout(this.doLogout, 3000);
            },
            doLogout() {
                this.$store.commit('setToken', null);
                this.$cookies.removeAll();
                this.logoutInProgress = false;
            },
            async deleteAccount() {
                await this.$confirm(this.$t('user.deleteAccountConfirm'), 'danger');

                const response = await this.$post(`/user/delete`);
                this.logout();
            },
        },
        computed: {
            ...mapState([
                'user',
            ]),
            canChangeEmail() {
                return this.email && this.captchaToken;
            }
        },
    }
</script>

<style lang="scss" scoped>
    .narrow-message {
        max-width: 56ch;
    }
</style>
