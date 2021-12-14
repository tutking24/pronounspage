<template>
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-center">
        <span class="my-2">
            <Icon :v="providerOptions.icon || provider" set="b"/>
            {{ providerOptions.name }}
        </span>
        <span v-if="connection === undefined">
            <template v-if="providerOptions.instanceRequired">
                <form v-if="formShown"
                      :action="`${homeUrl}/api/user/social-redirect/${provider}/${config.locale}`"
                      class="input-group input-group-sm">
                    <input type="text" name="instance" class="form-control" autofocus required
                           :placeholder="$t('user.login.instancePlaceholder')"/>
                    <button type="submit" class="btn btn-outline-secondary">
                        <Icon v="link"/>
                    </button>
                </form>
                <button v-else class="badge bg-light text-dark border" @click="formShown = true">
                    <Icon v="link"/>
                    <T>user.socialConnection.connect</T>
                </button>
            </template>
            <a v-else :href="`${homeUrl}/api/user/social-redirect/${provider}/${config.locale}`" class="badge bg-light text-dark border">
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
            <a :href="`${homeUrl}/api/user/social-redirect/${provider}/${config.locale}` + (providerOptions.instanceRequired ? '?instance=' + connection.name.split('@')[1] : '')"
                    class="badge bg-light text-dark border">
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
                homeUrl: process.env.HOME_URL,
                formShown: false,
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
