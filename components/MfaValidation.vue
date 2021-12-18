<template>
    <section>
        <Alert type="danger" :message="error"/>

        <div class="card shadow">
            <div class="card-body">
                <p class="h4">
                    <Icon v="mobile"/>
                    <T>user.mfa.header</T>
                </p>
                <form @submit.prevent="validate" :disabled="saving">
                    <div class="input-group mb-3">
                        <input v-if="!recovery" type="text" class="form-control text-center" v-model="code"
                               placeholder="000000" autofocus required minlength="0" maxlength="6"
                               inputmode="numeric" pattern="[0-9]{6}" autocomplete="one-time-code"
                        />
                        <input v-else type="text" class="form-control text-center" v-model="recoveryCode"
                               :placeholder="$t('user.mfa.recovery.header')" autofocus required minlength="0" maxlength="24"
                               autocomplete="one-time-code"
                        />
                        <button class="btn btn-primary">
                            <Icon v="key"/>
                            <T>user.code.action</T>
                        </button>
                    </div>
                </form>
            </div>
            <div class="card-footer small d-flex justify-content-around">
                <a href="#" @click.prevent="recoverySwitch">
                    <Icon v="ambulance"/>
                    <T>user.mfa.recovery.enter</T>
                </a>
                <a href="#" @click.prevent="cancel">
                    <Icon v="sign-out"/>
                    <T>user.mfa.cancel</T>
                </a>
            </div>
        </div>
    </section>
</template>

<script>
    import {mapState} from "vuex";

    export default {
        data() {
            return {
                code: '',
                recoveryCode: '',
                recovery: false,
                saving: false,
                error: '',
            }
        },
        mounted() {
            this.focus();
        },
        methods: {
            async validate() {
                if (this.saving) {
                    return;
                }
                this.error = '';
                this.saving = true;
                try {
                    const res = await this.$axios.$post(`/mfa/validate`, {
                        code: this.recovery ? this.recoveryCode : this.code,
                        recovery: this.recovery,
                    }, {
                        headers: {
                            authorization: 'Bearer ' + this.preToken,
                        },
                    });
                    if (res.error) {
                        this.error = res.error;
                        return;
                    }
                    this.$store.commit('setToken', res.token);
                } finally {
                    this.saving = false;
                    this.code = '';
                    this.recoveryCode = '';
                    this.recovery = false;
                    this.focus();
                }
            },
            cancel() {
                this.$store.commit('cancelMfa');
            },
            recoverySwitch() {
                this.recovery = !this.recovery;
                this.code = '';
                this.recoveryCode = '';
                this.focus();
            },
            focus() {
                this.$nextTick(() => this.$el.querySelector('input').focus());
            }
        },
        computed: {
            ...mapState([
                'preToken',
            ]),
        },
    };
</script>
