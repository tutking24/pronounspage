<template>
    <section v-if="logoutInProgress">
        <p class="text-center">
            <Spinner size="5rem"/>
        </p>
        <div v-if="!impersonationActive">
            <iframe v-for="domain in universalDomains"
                    :src="`${domain}/api/user/logout-universal`"
                    style="width: 1px; height: 1px; opacity: .01"
            >
            </iframe>
        </div>
    </section>
    <section v-else>
        <div v-if="showTermsUpdate" class="alert alert-info container my-4 small">
            <h4 class="mb-3">
                <Icon v="info-circle"/>
                <T>terms.update.header</T>
            </h4>
            <p>
                <T>terms.update.intro</T>
            </p>
            <ul>
                <li v-for="change in $t('terms.update.changes')">
                    {{ change }}
                </li>
            </ul>
            <p class="text-center">
                <button class="btn btn-primary" @click.prevent="dismissTermsUpdate">
                    <Icon v="shield-check"/>
                    <T>confirm.ok</T>
                </button>
            </p>
        </div>
        <AdPlaceholder phkey="small-homepage"/>
        <div class="card mb-3">
            <div class="card-body d-flex flex-column flex-md-row">
                <div class="mx-2 text-center">
                    <p class="mb-0">
                        <Avatar :user="$user()" validate/>
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
                        <ImageUploader small @uploaded="uploaded" sizes="avatar"/>
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
                            <T :params="messageParams">{{message}}</T>
                        </p>
                    </div>

                    <form @submit.prevent="changeUsername" :disabled="savingUsername">
                        <h3 class="h6"><T>user.account.changeUsername.header</T></h3>
                        <input type="text" class="form-control mb-3" v-model="username"
                           required minlength="4" maxlength="16"/>
                        <p v-if="usernameError" class="small text-danger">
                            <Icon v="exclamation-triangle"/>
                            <span class="ml-1">{{usernameError}}</span>
                        </p>
                        <div class="d-none d-md-block mt-3">
                            <button class="btn btn-outline-primary" :disabled="username === user.username">
                                <T>user.account.changeUsername.action</T>
                            </button>
                        </div>
                        <div class="d-block d-md-none mt-3">
                            <button class="btn btn-outline-primary w-100" :disabled="username === user.username">
                                <T>user.account.changeUsername.action</T>
                            </button>
                        </div>
                    </form>

                    <hr/>

                    <form @submit.prevent="changeEmail" :disabled="savingEmail">
                        <h3 class="h6"><T>user.account.changeEmail.header</T></h3>
                        <div v-if="!changeEmailAuthId" class="">
                            <input type="email" class="form-control mb-3" v-model="email" required/>
                            <div class="d-flex flex-column flex-md-row">
                                <Captcha v-if="showCaptcha" v-model="captchaToken"/>
                                <div :class="['d-none', 'd-md-block', showCaptcha ? 'ms-3' : '']">
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
                </div>
            </div>
        </div>

        <AdPlaceholder phkey="main-0"/>

        <Loading :value="profiles">
            <template v-slot:header>
                <h3 class="h4"><T>profile.list</T><T>quotation.colon</T></h3>
            </template>
            <ul v-if="profiles !== undefined" class="list-group">
                <li v-for="(options, locale) in locales" :key="locale" :class="['list-group-item', locale === config.locale ? 'profile-current' : '']">
                    <ProfileOverview :username="username" :profile="profiles[locale]" :locale="locale" @update="setProfiles"/>
                </li>
            </ul>
        </Loading>

        <AdPlaceholder phkey="main-1"/>

        <Loading :value="socialConnections">
            <template v-slot:header>
                <h3 class="h4"><T>user.socialConnection.list</T><T>quotation.colon</T></h3>
            </template>
            <ul v-if="socialConnections !== undefined" class="list-group">
                <li v-for="(providerOptions, provider) in socialProviders" :key="provider" :class="['list-group-item', socialConnections[provider] !== undefined ? 'profile-current' : '']">
                    <SocialConnection :provider="provider" :providerOptions="providerOptions" :connection="socialConnections[provider]"
                                      @disconnected="socialConnections[provider] = undefined" @setAvatar="setAvatar"/>
                </li>
                <li :class="['list-group-item', $user().mfa ? 'profile-current' : '']">
                    <MfaConnection/>
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

            <a v-if="impersonationActive" href="#" class="badge bg-light text-dark border border-primary" @click.prevent="stopImpersonation">
                <Icon v="user-secret"/>
                Stop impersonation
            </a>
        </section>

        <AdPlaceholder phkey="main-2"/>

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
    import {socialProviders} from "../src/socialProviders";
    import {gravatar} from "../src/helpers";
    import cookieSettings from "../src/cookieSettings";
    import {mapState} from "vuex";
    import { usernameRegex } from '../src/username';

    export default {
        data() {
            return {
                username: this.$user().username,
                email: this.$user().email,

                message: '',
                messageParams: {},
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

                showCaptcha: false,
                captchaToken: null,

                universalDomains: process.env.ALL_LOCALES_URLS.split(',').filter(x => x !== process.env.BASE_URL),

                logoutInProgress: false,

                impersonationActive: !!this.$cookies.get('impersonator'),

                showTermsUpdate: false,
                    // this.$ulidTime(this.$user().id) < new Date(2021, 11, 13) / 1000
                    // && !this.$cookies.get('termsUpdateDismissed')
                    // && (!this.$user().lastActive || this.$user().lastActive < +new Date(2021, 11, 18, 0, 0, 0))
            }
        },
        async mounted() {
            this.profiles = (await this.$axios.$get(`/profile/get/${this.$user().username}?version=2`)).profiles;
            this.socialConnections = await this.$axios.$get(`/user/social-connections`);
            const user = await this.$axios.$get(`/user/current`);
            if (user) {
                this.$store.commit('setToken', user.token);
            }

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
                    this.username = this.$user().username;
                    this.$cookies.set('token', this.$store.state.token, cookieSettings);
                    this.message = 'crud.saved';
                    this.messageParams = {};
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
                        captchaToken: this.captchaToken,
                    });

                    if (response.error) {
                        this.error = response.error;
                        return;
                    }

                    if (!this.changeEmailAuthId) {
                        this.changeEmailAuthId = response.authId;
                        this.message = 'user.login.emailSent';
                        this.messageParams = {'email': this.addBrackets(this.email)};
                        this.messageIcon = 'envelope-open-text';
                        this.$nextTick(_ => {
                            this.$refs.code.focus();
                        });
                    } else {
                        this.changeEmailAuthId = null;
                        this.message = '';
                        this.messageParams = {};
                        this.code = null;

                        this.$store.commit('setToken', response.token);
                        this.$cookies.set('token', this.$store.state.token, cookieSettings);
                        this.message = 'crud.saved';
                        this.messageParams = {};
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
            setProfiles(profiles) {
                this.profiles = profiles;
            },
            async deleteAccount() {
                await this.$confirm(this.$t('user.deleteAccountConfirm'), 'danger');

                const response = await this.$post(`/user/delete`);

                if (this.impersonationActive) {
                    this.stopImpersonation();
                } else {
                    this.logout();
                }
            },
            async setAvatar(source) {
                const response = await this.$post(`/user/set-avatar`, {source});

                this.$store.commit('setToken', response.token);
                this.$cookies.set('token', this.$store.state.token, cookieSettings);
            },
            async uploaded(ids) {
                await this.setAvatar(`${process.env.CLOUDFRONT}/images/${ids[0]}-avatar.png`);
            },
            async stopImpersonation() {
                this.$cookies.set('token', this.$cookies.get('impersonator'));
                this.$cookies.remove('impersonator');
                window.location.reload();
            },
            dismissTermsUpdate() {
                this.$cookies.set('termsUpdateDismissed', true);
                this.showTermsUpdate = false;
            },
            addBrackets(str) {
                return str ? `(${str})` : '';
            },
        },
        computed: {
            ...mapState([
                'user',
            ]),
            canChangeEmail() {
                return this.email && this.captchaToken;
            },
            usernameError() {
                if (!this.username.match(usernameRegex)) {
                    return this.$t('user.account.changeUsername.invalid');
                }
                if (this.username !== encodeURIComponent(this.username)) {
                    return this.$t('user.account.changeUsername.nonascii', {encoded: encodeURIComponent(this.username)});
                }
                return null;
            },
        },
        watch: {
            email(v) {
                if (v !== this.$user().email) {
                    this.showCaptcha = true;
                }
            },
        }
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
