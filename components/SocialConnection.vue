<template>
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-center">
        <span class="my-2">
            <Icon :v="providerOptions.icon || provider" set="b"
                  :class="[providerOptions.icon && providerOptions.icon.endsWith('.png') ? 'mx-1 invertible' : '']"/>
            {{ providerOptions.name }}
            <button v-if="providerOptions.deprecated" class="badge bg-light text-dark border border-warning" @click="depreciationNotice(providerOptions.deprecated)">
                <Icon v="exclamation-triangle"/>
                <T>user.login.deprecated</T>
            </button>
        </span>
        <span v-if="connection === undefined">
            <template v-if="providerOptions.instanceRequired">
                <form v-if="formShown"
                      :action="providerOptions.redirectViaHome ? `${homeUrl}/api/user/social-redirect/${provider}/${config.locale}` : `/api/connect/${provider}`"
                      class="input-group input-group-sm">
                    <input type="text" name="instance" class="form-control" autofocus required
                           :placeholder="$t(providerOptions.domain ? 'user.login.domainPlaceholder' : 'user.login.instancePlaceholder')"/>
                    <button type="submit" class="btn btn-outline-secondary">
                        <Icon v="link"/>
                    </button>
                </form>
                <button v-else class="badge bg-light text-dark border" @click="formShown = true">
                    <Icon v="link"/>
                    <T>user.socialConnection.connect</T>
                </button>
            </template>
            <a v-else :href="providerOptions.redirectViaHome ? `${homeUrl}/api/user/social-redirect/${provider}/${config.locale}` : `/api/connect/${provider}`" class="badge bg-light text-dark border">
                <Icon v="link"/>
                <T>user.socialConnection.connect</T>
            </a>
        </span>
        <span v-else class="text-center">
            <span class="me-2">
                <a v-if="providerOptions.avatars && connection.avatar" href="#" @click.prevent="$emit('setAvatar', provider)">
                    <Avatar :src="connection.avatarCopy || connection.avatar" :user="$user()" dsize="2rem" validate/>
                </a>
                {{connection.name}}
            </span>
            <br class="d-md-none"/>
            <a :href="(providerOptions.redirectViaHome ? `${homeUrl}/api/user/social-redirect/${provider}/${config.locale}` : `/api/connect/${provider}`) + (providerOptions.instanceRequired ? '?instance=' + connection.name.split('@').slice(-1)[0] : '')"
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
        async depreciationNotice(link) {
            await this.$alert(this.$t('user.login.depreciationNotice', {link}), 'warning');
        }
    },
}
</script>
