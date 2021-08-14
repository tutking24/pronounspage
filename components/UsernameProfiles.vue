<template>
    <ul class="list-group rounded-top-0">
        <!-- <a  href="#" @click.prevent="$emit('setAvatar', provider)"> -->
        <li class="list-group-item border-top-0">
            <div class="row">
                <div class="col-12 col-lg-6">
                    <div class="card-body d-flex">
                        <p class="mb-0 ms-1 me-3">
                            <Avatar :src="username.avatar"/>
                        </p>
                        <div class="mb-2">
                            <div v-if="username.avatarSource === 'gravatar'" class="mt-2">
                                <a href="https://gravatar.com" target="_blank" rel="noopener" class="small">
                                    <Icon v="external-link"/>
                                    <T>user.avatar.change</T>
                                    Gravatar
                                </a>
                            </div>
                            <div v-else class="mt-3">
                                Gravatar:
                                <!--
                                <a href="#" @click.prevent="setAvatar('gravatar')">
                                    <Avatar :user="$user()" :src="gravatar($user())" dsize="2rem"/>
                                </a>
                                -->
                            </div>
                            <div v-if="username.avatarSource">
                                <a href="#" @click.prevent="setAvatar(null)" class="small">
                                    <Icon v="trash"/>
                                    <T>crud.remove</T>
                                </a>
                            </div>
                            <ImageUploader small @uploaded="uploaded"/>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-lg-6">
                    <form @submit.prevent="changeUsername" :disabled="savingUsername" class="mt-lg-4">
                        <h3 class="h6"><T>user.account.changeUsername.header</T></h3>
                        <div class="input-group mb-3">
                            <input type="text" class="form-control" v-model="usernameV"
                                   required minlength="4" maxlength="16"/>
                            <button class="btn btn-outline-primary">
                                <T>user.account.changeUsername.action</T>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </li>
        <li v-for="(options, locale) in locales" :key="locale" :class="['list-group-item', locale === config.locale ? 'profile-current' : '']">
            <ProfileOverview :username="username.username" :profile="username.profiles[locale]" :locale="locale" @update="setProfiles"/>
        </li>
    </ul>
</template>

<script>
    import cookieSettings from "../src/cookieSettings";

    export default {
        props: {
            id: { required: true },
            username: { required: true },
        },
        data() {
            return {
                usernameV: this.username.username,
            }
        },
        methods: {
            // TODO
            async changeUsername() {
                this.error = '';

                if (this.savingUsername) { return; }
                this.savingUsername = true;
                try {
                    const response = await this.$post(`/user/change-username`, {
                        username: this.username,
                    });

                    if (response.error) {
                        this.error = response.error;
                        return;
                    }

                    this.$store.commit('setToken', response.token);
                    this.$cookies.set('token', this.$store.state.token, cookieSettings);
                    this.message = 'crud.saved';
                    this.messageIcon = 'check-circle';
                    setTimeout(() => this.message = '', 3000);
                } finally {
                    this.savingUsername = false;
                }
            },
            // TODO
            setProfiles(profiles) {
                this.profiles = profiles;
            },
            // TODO
            async setAvatar(source) {
                const response = await this.$post(`/user/set-avatar`, {source});

                this.$store.commit('setToken', response.token);
                this.$cookies.set('token', this.$store.state.token, cookieSettings);
            },
            async uploaded(ids) {
                await this.setAvatar(`${process.env.BUCKET}/images/${ids[0]}-thumb.png`);
            },
        }
    }
</script>

<style lang="scss" scoped>
    @import "assets/variables";

    .profile-current {
        border-inline-start: 3px solid $primary;
    }

    .rounded-top-0 {
        border-top-left-radius: 0 !important;
        border-top-right-radius: 0 !important;
    }
</style>
