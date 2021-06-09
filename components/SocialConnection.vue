<template>
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-center">
        <span class="my-2">
            <Icon :v="providerOptions.icon || provider" set="b"/>
            {{ providerOptions.name }}
        </span>
        <span v-if="connection === undefined">
            <a :href="`/api/connect/${provider}`" class="badge bg-light text-dark border">
                <Icon v="link"/>
                <T>user.socialConnection.connect</T>
            </a>
        </span>
        <span v-else class="text-center">
            <span class="mr-3">
                <a href="#" @click.prevent="$emit('setAvatar', provider)">
                    <Avatar :src="connection.avatar" :user="$user()" dsize="2rem"/>
                </a>
                {{connection.name}}
            </span>
            <br class="d-md-none"/>
            <a :href="`/api/connect/${provider}`" class="badge bg-light text-dark border">
                <Icon v="sync"/>
                <T>user.socialConnection.refresh</T>
            </a>
            <Spinner v-if="disconnecting"/>
            <a v-else href="#" class="badge bg-light text-dark" @click.prevent="disconnect">
                <Icon v="unlink"/>
                <T>user.socialConnection.disconnect</T>
            </a>
        </span>
    </div>
</template>

<script>
    export default {
        props: {
            provider: { required: true },
            providerOptions: { required: true },
            connection: {},
        },
        data() {
            return {
                disconnecting: false,
            }
        },
        methods: {
            async disconnect() {
                await this.$confirm(this.$t('user.socialConnection.disconnectConfirm', {email: this.$user().email}), 'danger');

                this.disconnecting = true;
                try {
                    const response = await this.$post(`/user/social-connection/${this.provider}/disconnect`);
                    this.$emit('disconnected', response);
                } finally {
                    this.disconnecting = false;
                }
            },
        },
    }
</script>
