<template>
    <section>
        <Alert type="danger" :message="error"/>

        <div class="card">
            <div class="card-body">
                <div v-if="token === null">
                    <div class="row">
                        <div class="col-12 col-md-8">
                            <form @submit.prevent="login" :disabled="saving" class="mb-4 mb-md-0">
                                <input type="text" class="form-control mb-3" v-model="usernameOrEmail"
                                       :placeholder="$t('user.login.placeholder')" autofocus required/>
                                <p class="small text-muted mb-1">
                                    <Icon v="info-circle"/>
                                    <T>captcha.reason</T>
                                </p>
                                <Captcha class="h-captcha" v-model="captchaToken"/>
                                <button class="btn btn-primary mt-3 d-none d-md-block" :disabled="!canInit">
                                    <Icon v="sign-in"/>
                                    <T>user.login.action</T>
                                </button>
                                <button class="btn btn-primary mt-3 d-block d-md-none w-100" :disabled="!canInit">
                                    <Icon v="sign-in"/>
                                    <T>user.login.action</T>
                                </button>
                            </form>
                        </div>
                        <div class="col-12 col-md-4">
                            <div class="btn-group-vertical w-100 mb-3">
                                <a :href="`/api/connect/${provider}`" v-for="(providerOptions, provider) in socialProviders" class="btn btn-outline-primary">
                                    <Icon :v="providerOptions.icon || provider" set="b"/>
                                    {{ providerOptions.name }}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else-if="payload && !payload.code">
                    <div class="alert alert-success">
                        <p class="mb-0">
                            <Icon v="envelope-open-text"/>
                            <T>user.login.emailSent</T>
                        </p>
                    </div>

                    <form @submit.prevent="validate" :disabled="saving">
                        <div class="input-group mb-3">
                            <input type="text" class="form-control text-center" v-model="code"
                                   placeholder="000000" autofocus required minlength="0" maxlength="6"
                                   inputmode="numeric" pattern="[0-9]{6}" autocomplete="one-time-code"
                                   ref="code"
                            />
                            <button class="btn btn-primary">
                                <Icon v="key"/>
                                <T>user.code.action</T>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <div class="card-footer small">
                <p>
                    <Icon v="info-circle"/>
                    <T>user.login.why</T>
                </p>
                <p>
                    <Icon v="gavel"/>
                    <T>terms.consent</T>
                </p>
                <p class="mb-0">
                    <Icon v="lock"/>
                    <T>user.login.passwordless</T>
                </p>
            </div>
        </div>
    </section>
</template>

<script>
    import jwt from 'jsonwebtoken';
    import {socialProviders} from "../src/data";
    import cookieSettings from "../src/cookieSettings";

    export default {
        data() {
            return {
                token: null,
                usernameOrEmail: '',
                code: '',

                error: '',

                socialProviders,

                saving: false,

                captchaToken: null,
            };
        },
        computed: {
            payload() {
                if (!this.token) {
                    return null;
                }

                this.$store.commit('setToken', this.token);
                this.$cookies.set('token', this.$store.state.token, cookieSettings);

                return jwt.verify(this.token, process.env.PUBLIC_KEY, {
                    algorithm: 'RS256',
                    audience: this.$base,
                    issuer: this.$base,
                });
            },
            canInit() {
                return this.usernameOrEmail && this.captchaToken;
            },
        },
        methods: {
            async login() {
                if (this.saving) {
                    return;
                }
                this.saving = true;
                try {
                    await this.post(`/user/init`, {
                        usernameOrEmail: this.usernameOrEmail,
                        captchaToken: this.captchaToken,
                    });
                } finally {
                    this.saving = false;
                }
            },
            async validate() {
                if (this.saving) {
                    return;
                }
                this.saving = true;
                try {
                    await this.post(`/user/validate`, {
                        code: this.code
                    }, {
                        headers: {
                            authorization: 'Bearer ' + this.token,
                        },
                    });
                } finally {
                    this.saving = false;
                }
            },
            async post(url, data, options = {}) {
                this.error = '';

                const response = await this.$post(url, data, options);

                this.usernameOrEmail = '';
                this.code = '';

                if (response.error) {
                    this.error = response.error;
                    return;
                }

                this.token = response.token;

                this.$nextTick(_ => {
                    if (this.$refs.code) {
                        this.$refs.code.focus();
                    }
                })
            },
        },
    }
</script>
