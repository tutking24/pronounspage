<template>
    <client-only v-if="config.profile.editorEnabled">
        <section v-if="$isGranted('users')">
            <div class="alert alert-warning">
                <textarea v-model="user.bannedReason" class="form-control" rows="3" :placeholder="$t('ban.reason') + ' ' + $t('ban.visible')" :disabled="saving"></textarea>
                <button class="btn btn-danger d-block w-100 mt-2" :disabled="saving" @click="ban">
                    <Icon v="ban"/>
                    {{$t('ban.action')}}
                </button>
            </div>
        </section>
    </client-only>
</template>

<script>
    import ClientOnly from 'vue-client-only'

    export default {
        components: { ClientOnly },
        props: {
            user: { required: true },
        },
        data() {
            return {
                saving: false,
            }
        },
        methods: {
            async ban() {
                await this.$confirm(this.$t('ban.confirm', {username: this.user.username}), 'danger');
                this.saving = true;
                try {
                    await this.$post(`/admin/ban/${encodeURIComponent(this.user.username)}`, {
                        reason: this.user.bannedReason,
                    });
                    window.location.reload();
                } finally {
                    this.saving = false;
                }
            }
        },
    }
</script>
