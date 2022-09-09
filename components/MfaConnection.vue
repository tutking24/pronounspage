<template>
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-center">
        <span class="my-2 me-3 text-nowrap">
            <Icon v="mobile"/>
            <T>user.mfa.header</T>
        </span>
        <Spinner v-if="requesting" size="2rem"/>
        <template v-else>
            <div v-if="$user().mfa">
                <span class="badge bg-success">
                    <Icon v="shield-check"/>
                    <T>user.mfa.enabled</T>
                </span>
                <button class="badge bg-light text-dark border" @click.prevent="disable">
                    <Icon v="unlink"/>
                    <T>user.mfa.disable</T>
                </button>
            </div>
            <div v-else-if="!secret">
                <button class="badge bg-light text-dark border" @click="getLink">
                    <Icon v="link"/>
                    <T>user.mfa.enable</T>
                </button>
            </div>
            <div v-else-if="recoveryCodes === null" class="text-center">
                <div class="alert alert-info">
                    <Icon v="info-circle"/>
                    <T>user.mfa.init</T>
                </div>
                <p>
                    <QrCode :url="secret.otpauth_url" style="max-width: 200px; margin: 0 auto;"/>
                    <br/>
                    <small>{{secret.base32}}</small>
                </p>
                <form @submit.prevent="init" class="input-group mb-3">
                    <input type="text" class="form-control text-center" v-model="code"
                           placeholder="000000" autofocus required minlength="0" maxlength="6"
                           inputmode="numeric" pattern="[0-9]{6}" autocomplete="one-time-code"
                           ref="code"
                    />
                    <button class="btn btn-outline-primary">
                        <Icon v="key"/>
                        <T>user.code.action</T>
                    </button>
                </form>
            </div>
            <div v-else>
                <p>
                    <Icon v="info-circle"/>
                    <T>user.mfa.recovery.save</T>
                </p>
                <ul class="mb-4">
                    <li v-for="code in recoveryCodes">{{code}}</li>
                </ul>
                <p>
                    <button class="btn btn-primary" @click="$user().mfa = true">
                        <Icon v="shield-check"/>
                        <T>user.mfa.recovery.saved</T>
                    </button>
                </p>
            </div>
        </template>
    </div>
</template>

<script>
export default {
    data() {
        return {
            secret: null,
            code: '',
            validation: null,
            recoveryCodes: null,
            requesting: false,
        }
    },
    methods: {
        async getLink() {
            this.requesting = true;
            this.secret = await this.$axios.$get('/mfa/get-url');
            this.requesting = false;
        },
        async init() {
            this.requesting = true;
            try {
                this.recoveryCodes = await this.$axios.$post('/mfa/init', {
                    secret: this.secret.base32,
                    token: this.code,
                });
            } catch {
                await this.$alert(this.$t('user.code.invalid'), 'danger');
            } finally {
                this.requesting = false;
                this.code = '';
            }
        },
        async disable() {
            await this.$confirm(this.$t('user.mfa.disableConfirm'), 'danger');
            await this.$post('/mfa/disable');
            window.location.reload();
        },
    },
}
</script>
