<template>
    <div v-if="options.instanceRequired && formShown" class="btn border-primary text-primary">
        <Icon :v="options.icon || provider" set="b"/>
        {{ options.name }}

        <form :action="options.redirectViaHome ? `${homeUrl}/api/user/social-redirect/${provider}/${config.locale}` : `/api/connect/${provider}`"
              v-if="options.instanceRequired" class="input-group my-2">
            <input type="text" name="instance" class="form-control" autofocus required ref="instance"
                   :placeholder="$t('user.login.instancePlaceholder')">
            <button type="submit" class="btn btn-outline-primary">
                <Icon v="arrow-right"/>
            </button>
        </form>
    </div>
    <button v-else-if="options.instanceRequired && !formShown"
            class="btn btn-outline-primary"
            @click="showForm">
        <Icon :v="options.icon || provider" set="b"
              :class="[options.icon && options.icon.endsWith('.png') ? 'mx-1 invertible' : '']"/>
        {{ options.name }}
    </button>
    <a v-else :href="options.redirectViaHome ? `${homeUrl}/api/user/social-redirect/${provider}/${config.locale}` : `/api/connect/${provider}`"
       class="btn btn-outline-primary">
        <Icon :v="options.icon || provider" set="b"/>
        {{ options.name }}
    </a>
</template>

<script>
export default {
    props: {
        provider: { required: true },
        options: { required: true },
    },
    data() {
        return {
            homeUrl: process.env.HOME_URL,
            formShown: false,
        };
    },
    methods: {
        showForm() {
            this.formShown = true;
            this.$nextTick(() => this.$refs.instance.focus());
        }
    }
};
</script>
