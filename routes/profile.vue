<template>
    <div v-if="profile">
        <section v-if="$isGranted('users') && user.bannedReason">
            <div class="alert alert-warning">
                <p class="h4">
                    <Icon v="ban"/>
                    {{$t('ban.banned')}}
                </p>
                <p class="mb-0">{{user.bannedReason}}</p>
            </div>
        </section>

        <Profile :user="user" :profile="profile" :terms="terms">
            <div v-if="Object.keys(user.profiles).length > 1">
                <LocaleLink v-for="(options, locale) in locales" :key="locale" v-if="user.profiles[locale] !== undefined"
                            :locale="locale" :link="`/@${user.username}`"
                            :class="['btn', locale === config.locale ? 'btn-primary disabled' : 'btn-outline-primary', 'btn-sm', 'mb-2 mx-1']">
                    {{options.name}}
                </LocaleLink>
            </div>
            <div v-if="$user() && $user().username === user.username">
                <nuxt-link to="/editor" class="btn btn-primary btn-sm mb-2 mx-1">
                    <Icon v="edit"/>
                    <T>profile.edit</T>
                </nuxt-link>
                <a :href="`https://pronouns.page/@${user.username}`" v-if="Object.keys(user.profiles).length > 1"
                   class="btn btn-outline-secondary btn-sm mb-2 mx-1"
                >
                    <Icon v="external-link"/>
                    pronouns.page/@{{user.username}}
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

        <Ban :user="user"/>

        <Separator icon="heart"/>
        <Support/>
        <section>
            <Share/>
        </section>
    </div>
    <div v-else-if="user.username">
        <h2 class="text-nowrap mb-3">
            <Avatar :user="user"/>
            @{{username}}
        </h2>

        <div v-if="Object.keys(user.profiles).length" class="list-group">
            <LocaleLink v-for="(options, locale) in locales" :key="locale" v-if="user.profiles[locale] !== undefined"
                        :locale="locale" :link="`/@${username}`"
                        class="list-group-item list-group-item-action list-group-item-hoverable">
                <div class="h3">
                    {{options.name}}
                </div>
            </LocaleLink>
        </div>
        <div v-else class="alert alert-info">
            <p class="mb-0">
                <Icon v="info-circle"/>
                <T>profile.empty</T>
            </p>
        </div>

        <Ban :user="user"/>
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
                 terms: [],
            }
        },
        async asyncData({ app, route }) {
            return {
                user: await app.$axios.$get(`/profile/get/${encodeURIComponent(route.params.pathMatch)}`),
            };
        },
        async mounted() {
            if (this.config.nouns.terms.enabled) {
                this.terms = await this.$axios.$get(`/terms`);
            }
        },
        computed: {
            profile() {
                for (let locale in this.user.profiles) {
                    if (locale === this.config.locale) {
                        return this.user.profiles[locale];
                    }
                }

                return null;
            },
            username() {
                const base = this.$route.params.pathMatch;

                if (!this.profile) {
                    return base;
                }

                if (this.user.username !== base && process.client) {
                    history.pushState(
                        '',
                        document.title,
                        '/@' + this.user.username,
                    );
                }

                return this.user.username;
            },
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
