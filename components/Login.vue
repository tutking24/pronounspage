<template>
    <section>
        <Alert type="danger" :message="error"/>

        <div v-if="token === null">
            <form @submit.prevent="login">
                <p>
                    <Icon v="info-circle"/>
                    <T>user.login.why</T>
                </p>
                <div class="input-group mb-3">
                    <input type="text" class="form-control" v-model="usernameOrEmail"
                           :placeholder="$t('user.login.placeholder')" autofocus required/>
                    <div class="input-group-append">
                        <button class="btn btn-primary">
                            <Icon v="sign-in"/>
                            <T>user.login.action</T>
                        </button>
                    </div>
                </div>
                <div class="btn-group btn-block mb-3">
                    <a :href="`/api/connect/${provider}`" v-for="(providerOptions, provider) in socialProviders" class="btn btn-outline-primary">
                        <Icon :v="providerOptions.icon || provider" set="b"/>
                        {{ providerOptions.name }}
                    </a>
                </div>
                <p class="small text-muted">
                    <Icon v="gavel"/>
                    <T>terms.consent</T>
                </p>
                <p class="small text-muted">
                    <Icon v="lock"/>
                    <T>user.login.passwordless</T>
                </p>
            </form>
        </div>
        <div v-else-if="payload && !payload.code">
            <div class="alert alert-success">
                <p class="mb-0">
                    <Icon v="envelope-open-text"/>
                    <T>user.login.emailSent</T>
                </p>
            </div>

            <form @submit.prevent="validate">
                <div class="input-group mb-3">
                    <input type="text" class="form-control text-center" v-model="code"
                           placeholder="000000" autofocus required minlength="0" maxlength="6"
                           inputmode="numeric" pattern="[0-9]{6}" autocomplete="one-time-code"
                           ref="code"
                    />
                    <div class="input-group-append">
                        <button class="btn btn-primary">
                            <Icon v="key"/>
                            <T>user.code.action</T>
                        </button>
                    </div>
                </div>
            </form>
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
            }
        },
        methods: {
            async login() {
                await this.post(`/user/init`, {
                    usernameOrEmail: this.usernameOrEmail
                });
            },
            async validate() {
                await this.post(`/user/validate`, {
                    code: this.code
                }, {
                    headers: {
                        authorization: 'Bearer ' + this.token,
                    },
                });
            },
            async post(url, data, options = {}) {
                this.error = '';

                const response = await this.$axios.$post(url, data, options);

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
