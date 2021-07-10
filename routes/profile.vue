<template>
    <div v-if="profile">
        <section v-if="$isGranted('users') && profile.bannedReason">
            <div class="alert alert-warning">
                <p class="h4">
                    <Icon v="ban"/>
                    {{$t('ban.banned')}}
                </p>
                <p class="mb-0">{{profile.bannedReason}}</p>
            </div>
        </section>

        <Profile :profile="profile" :terms="terms">
            <div v-if="Object.keys(profiles).length > 1">
                <LocaleLink v-for="(options, locale) in locales" :key="locale" v-if="profiles[locale] !== undefined"
                            :locale="locale" :link="`/@${profile.username}`"
                            :class="['btn', locale === config.locale ? 'btn-primary disabled' : 'btn-outline-primary', 'btn-sm', 'mb-2 mx-1']">
                    {{options.name}}
                </LocaleLink>
            </div>
            <div v-if="$user() && $user().username === profile.username">
                <nuxt-link to="/editor" class="btn btn-primary btn-sm mb-2 mx-1">
                    <Icon v="edit"/>
                    <T>profile.edit</T>
                </nuxt-link>
                <a :href="`https://pronouns.page/@${profile.username}`" v-if="Object.keys(profiles).length > 1"
                   class="btn btn-outline-secondary btn-sm mb-2 mx-1"
                >
                    <Icon v="external-link"/>
                    pronouns.page/@{{profile.username}}
                </a>
            </div>
            <div v-if="($user() && $user().username === profile.username) || $isGranted('users')">
                <small>
                    <Icon v="id-card"/>
                    <T>profile.card.link</T>:
                </small>
                <template v-if="profile.card">
                    <a :href="profile.card" target="_blank" rel="noopener"
                       class="btn btn-outline-success btn-sm mb-2 mx-1">
                        <Icon v="sun"/>
                        <T>mode.light</T>
                    </a>
                    <a :href="profile.card.replace('.png', '-dark.png')" target="_blank" rel="noopener"
                       class="btn btn-outline-success btn-sm mb-2 mx-1">
                        <Icon v="moon"/>
                        <T>mode.dark</T>
                    </a>
                </template>
                <small v-else><T>profile.card.generating</T></small>
            </div>
        </Profile>

        <client-only>
            <section v-if="$isGranted('users')">
                <div class="alert alert-warning">
                    <textarea v-model="profile.bannedReason" class="form-control" rows="3" :placeholder="$t('ban.reason') + ' ' + $t('ban.visible')" :disabled="saving"></textarea>
                    <button class="btn btn-danger d-block w-100 mt-2" :disabled="saving" @click="ban">
                        <Icon v="ban"/>
                        {{$t('ban.action')}}
                    </button>
                </div>
            </section>
        </client-only>

        <Separator icon="heart"/>
        <Support/>
        <section>
            <Share/>
        </section>
    </div>
    <div v-else-if="Object.keys(profiles).length">
        <h2 class="text-nowrap mb-3">
            <Avatar :user="profiles[Object.keys(profiles)[0]]"/>
            @{{username}}
        </h2>

        <div class="list-group">
            <LocaleLink v-for="(options, locale) in locales" :key="locale" v-if="profiles[locale] !== undefined"
                        :locale="locale" :link="`/@${username}`"
                        class="list-group-item list-group-item-action list-group-item-hoverable">
                <div class="h3">
                    {{options.name}}
                </div>
            </LocaleLink>
        </div>
    </div>
    <NotFound v-else/>
</template>

<script>
    import { head } from "../src/helpers";
    import ClientOnly from 'vue-client-only'

    export default {
        components: { ClientOnly },
        data() {
             return {
                 saving: false,
                 terms: [],
            }
        },
        async asyncData({ app, route }) {
            return {
                profiles: await app.$axios.$get(`/profile/get/${encodeURIComponent(route.params.pathMatch)}`),
            };
        },
        async mounted() {
            if (this.config.nouns.terms.enabled) {
                this.terms = await this.$axios.$get(`/terms`);
            }
        },
        computed: {
            profile() {
                for (let locale in this.profiles) {
                    if (locale === this.config.locale) {
                        return this.profiles[locale];
                    }
                }

                return null;
            },
            username() {
                const base = this.$route.params.pathMatch;

                if (!this.profile) {
                    return base;
                }

                if (this.profile.username !== base && process.client) {
                    history.pushState(
                        '',
                        document.title,
                        '/@' + this.profile.username,
                    );
                }

                return this.profile.username;
            },
        },
        methods: {
            async ban() {
                await this.$confirm(this.$t('ban.confirm', {username: this.username}), 'danger');
                this.saving = true;
                try {
                    await this.$post(`/admin/ban/${encodeURIComponent(this.username)}`, {
                        reason: this.profile.bannedReason,
                    });
                    window.location.reload();
                } finally {
                    this.saving = false;
                }
            }
        },
        head() {
            return head({
                title: `@${this.username}`,
                banner: `api/banner/@${this.username}.png`,
            });
        },
    }
</script>

<style lang="scss" scoped>
    @import "assets/variables";

    .list-group-item-hoverable {
        &:hover {
            color: $primary;
            border-inline-start: 3px solid $primary;
            padding-inline-start: calc(#{$list-group-item-padding-x} - 2px);
        }
    }
</style>
