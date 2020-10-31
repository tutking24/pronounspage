<template>
    <div class="d-flex justify-content-between align-items-center">
        {{ locales[locale].name }}
        <span v-if="profile">
            <LocaleLink :locale="locale" :link="`/@${profile.username}`" class="badge badge-primary">
                <Icon v="id-card"/>
                <T>profile.show</T>
            </LocaleLink>
            <LocaleLink :locale="locale" :link="`/${config.profile.editorRoute}`" class="badge badge-light border">
                <Icon v="edit"/>
                <T>profile.edit</T>
            </LocaleLink>
            <Spinner v-if="deleting"/>
            <a v-else href="#" class="badge badge-light" @click.prevent="removeProfile(locale)" :aria-label="$t('profile.delete')">
                <Icon v="trash-alt"/>
            </a>
        </span>
        <span v-else>
            <LocaleLink :locale="locale" :link="`/${config.profile.editorRoute}`" class="badge badge-light border">
                <Icon v="plus-circle"/>
                <T>profile.init</T>
            </LocaleLink>
        </span>
    </div>
</template>

<script>
    export default {
        props: {
            profile: { required: true },
            locale: { required: true },
        },
        data() {
            return {
                deleting: false,
            }
        },
        methods: {
            async removeProfile() {
                await this.$confirm(this.$t('profile.deleteConfirm'), 'danger');

                this.deleting = true;
                const response = await this.$axios.$post(`/profile/delete/${this.config.locale}`, {}, { headers: this.$auth() });
                this.deleting = false;
                this.$emit('update', response);
            },
        },
    }
</script>
