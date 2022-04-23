<template>
    <div v-if="options.instanceRequired && formShown" class="btn border-primary text-primary">
        <Icon :v="options.icon || provider" set="b"/>
        {{ options.name }}

        <form :action="link"
              v-if="options.instanceRequired" class="input-group my-2">
            <input type="text" name="instance" class="form-control" autofocus required ref="instance"
                   :placeholder="$t(options.domain ? 'user.login.domainPlaceholder' : 'user.login.instancePlaceholder')"/>
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
    <a v-else-if="options.deprecated" :href="link"
       class="btn btn-outline-secondary btn-sm"
       @click.prevent="depreciationNotice(options.deprecated)"
    >
        <Icon :v="options.icon || provider" set="b"/>
        {{ options.name }}
    </a>
    <a v-else :href="link"
       class="btn btn-outline-primary"
    >
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
    computed: {
        link() {
            return this.options.redirectViaHome ? `${this.homeUrl}/api/user/social-redirect/${this.provider}/${this.config.locale}` : `/api/connect/${this.provider}`
        }
    },
    methods: {
        showForm() {
            this.formShown = true;
            this.$nextTick(() => this.$refs.instance.focus());
        },
        async depreciationNotice(link) {
            await this.$confirm(this.$t('user.login.depreciationNotice', {link}), 'warning');
            window.location.href = this.link;
        },
    }
};
</script>
