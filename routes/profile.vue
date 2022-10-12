<template>
    <Page v-if="profile">
        <section v-if="$isGranted('users') && user.bannedReason">
            <div class="alert alert-warning">
                <p class="h4">
                    <Icon v="ban"/>
                    {{$t('ban.banned')}}
                </p>
                <p>{{user.bannedReason}}</p>
                <p class="mb-0 small"><T>ban.appeal</T></p>
            </div>
        </section>

        <AdPlaceholder phkey="small-homepage"/>

        <MarkSus>
            <Profile :user="user" :profile="profile" :terms="terms"/>
        </MarkSus>

        <AdPlaceholder phkey="main-0"/>

        <template v-slot:aside-left>
            <ProfileShare :user="user" class="d-none d-xxl-block"/>
            <AdPlaceholder phkey="aside-left-middle" class="d-none d-xxl-block"/>
        </template>

        <template v-slot:aside-right>
            <div class="row">
                <div class="my-2 col-12 col-lg-4 col-xxl-12">
                    <AdPlaceholder phkey="aside-right-top"/>

                    <div v-if="$user() && $user().username === user.username" class="list-group list-group-flare">
                        <div class="list-group-item pt-3">
                            <h5>
                                <Icon v="user"/>
                                <T>profile.personal.header</T>
                            </h5>
                            <small><T>profile.personal.description</T></small>
                        </div>
                        <nuxt-link to="/editor" class="list-group-item list-group-item-action list-group-item-hoverable">
                            <Icon v="edit"/>
                            <T>profile.edit</T>
                        </nuxt-link>
                        <template v-if="cardsEnabled">
                            <a v-if="!cardMenuVisible && !(profile.card === '' || profile.cardDark === '')" href="#" class="list-group-item list-group-item-action list-group-item-hoverable" @click.prevent="cardMenuVisible = true">
                                <Icon v="id-card"/>
                                <T>profile.card.link</T>
                            </a>
                            <div v-else class="list-group-item">
                                <p class="small">
                                    <Icon v="id-card"/>
                                    <T>profile.card.link</T><T>quotation.colon</T>
                                </p>
                                <small v-if="profile.card === '' || profile.cardDark === ''">
                                    <Spinner/>
                                    <T>profile.card.generating</T>
                                </small>
                                <span v-else>
                            <a v-if="profile.card" :href="profile.card" target="_blank" rel="noopener"
                               class="btn btn-success btn-sm mx-1">
                                <Icon v="sun"/>
                                <T>mode.light</T>
                            </a>
                            <a v-if="profile.cardDark" :href="profile.cardDark" target="_blank" rel="noopener"
                               class="btn btn-success btn-sm mx-1">
                                <Icon v="moon"/>
                                <T>mode.dark</T>
                            </a>

                            <hr v-if="profile.card || profile.cardDark"/>
                            <small>
                                <T>profile.card.generate</T><T>quotation.colon</T><br/>
                                <button class="btn btn-outline-success btn-sm" @click="generateCard(false)">
                                    <Icon v="sun"/>
                                    <T>mode.light</T>
                                </button>
                                <button class="btn btn-outline-success btn-sm" @click="generateCard(true)">
                                    <Icon v="moon"/>
                                    <T>mode.dark</T>
                                </button>
                            </small>
                        </span>
                            </div>
                        </template>
                    </div>
                </div>

                <div class="my-2 col-12 col-lg-4 col-xxl-12">
                    <AdPlaceholder phkey="aside-right-middle"/>
                    <div v-if="Object.keys(user.profiles).length > 1 || $isGranted('*')" class="list-group list-group-flare">
                        <div class="list-group-item pt-3">
                            <h5>
                                <Icon v="language"/>
                                <T>profile.language.header</T>
                            </h5>
                            <small><T :params="{username: user.username}">profile.language.description</T><T>quotation.colon</T></small>
                        </div>
                        <LocaleLink v-for="(options, locale) in locales" :key="locale" v-show="user.profiles[locale] !== undefined"
                                    :locale="locale" :link="`/@${user.username}`"
                                    :class="['list-group-item list-group-item-action list-group-item-hoverable small', locale === config.locale ? 'list-group-item-active' : '']">
                            {{options.name}}
                        </LocaleLink>
                        <a :href="`https://pronouns.page/@${user.username}`" v-if="Object.keys(user.profiles).length > 1"
                           class="list-group-item list-group-item-action list-group-item-hoverable small"
                        >
                            <span class="badge bg-primary text-white">
                                <Icon v="link"/>
                                pronouns.page/@{{user.username}}
                            </span>
                        </a>
                        <a :href="`https://pronouns.page/u/${user.username}`" v-if="Object.keys(user.profiles).length > 1"
                           class="list-group-item list-group-item-action list-group-item-hoverable small"
                        >
                            <span class="badge bg-light text-dark border">
                                <Icon v="link"/>
                                pronouns.page/u/{{user.username}}
                            </span>
                        </a>
                        <a v-if="$isGranted('*')" href="#"
                           class="list-group-item list-group-item-action list-group-item-hoverable small"
                           @click.prevent="impersonate()"><Icon v="user-secret"/> Impersonate
                        </a>
                    </div>
                </div>

                <div class="my-2 col-12 col-lg-4 col-xxl-12">
                    <ProfileShare :user="user" class="d-xxl-none"/>
                    <AdPlaceholder phkey="aside-right-bottom"/>
                </div>
            </div>
        </template>

        <template v-slot:below>
            <Ban :user="user"/>

            <Separator icon="heart"/>
            <Support/>
            <div class="text-center my-4 small">
                <ReducedColoursSwitch/>
            </div>
        </template>
    </Page>
    <Page v-else-if="user.username">
        <div class="my-md-5 pt-md-2">
            <h2 class="text-nowrap mb-3">
                <Avatar :user="user"/>
                @{{username}}
            </h2>

            <div v-if="Object.keys(user.profiles).length" class="list-group">
                <LocaleLink v-for="(options, locale) in locales" :key="locale" v-if="user.profiles[locale] !== undefined"
                            :locale="locale" :link="`/@${username}`"
                            class="list-group-item list-group-item-action list-group-item-hoverable d-flex flex-column flex-md-row justify-content-between">
                    <div class="h3">
                        {{options.name}}
                    </div>
                    <div class="d-flex align-items-center">
                        <ForeignPronoun v-for="pronoun in selectMainPronouns(user.profiles[locale].pronouns)" :key="pronoun"
                                        :pronoun="pronoun" :locale="locale"/>
                    </div>
                </LocaleLink>
            </div>
            <div v-else class="alert alert-info">
                <p class="mb-0">
                    <Icon v="info-circle"/>
                    <T>profile.empty</T>
                </p>
            </div>

            <a v-for="link in verifiedLinks" :href="link" rel="me">&nbsp;</a>

            <Ban :user="user"/>
        </div>

        <template v-slot:aside-right>
            <ProfileShare v-if="Object.keys(user.profiles).length" :user="user" showQrStart class="aside-home"/>
        </template>
    </Page>
    <Page v-else>
        <NotFound/>
    </Page>
</template>

<script>
    import { head } from "../src/helpers";
    import opinions from '../src/opinions';

    export default {
        data() {
             return {
                 terms: [],
                 cardCheckHandle: null,
                 cardMenuVisible: false,

                 cardsEnabled: true,
            }
        },
        async asyncData({ app, route }) {
            return {
                user: await app.$axios.$get(`/profile/get/${encodeURIComponent(route.params.pathMatch)}?version=2`),
            };
        },
        async mounted() {
            if (this.config.terminology.enabled) {
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
            verifiedLinks() {
                return [...new Set(Object.values(this.user.profiles).map(p => Object.keys(p.verifiedLinks || {})).flat())];
            },
        },
        watch: {
            profile() {
                this.startCheckingForCard();
            },
        },
        methods: {
            async generateCard(dark) {
                await this.$axios.$post(`/profile/request-card?dark=${dark ? '1' : '0'}`);
                this.profile[dark ? 'cardDark' : 'card'] = '';
                this.startCheckingForCard();
            },
            startCheckingForCard() {
                if (this.cardCheckHandle || !this.profile || this.profile.card || this.profile.cardDark) {
                    return;
                }
                this.cardCheckHandle = setInterval(this.checkForCard, 3000);
            },
            async checkForCard() {
                try {
                    const card = await this.$axios.$get(`/profile/has-card`);
                    if (card.card !== '' && card.cardDark !== '') {
                        this.profile.card = card.card;
                        this.profile.cardDark = card.cardDark;
                        clearInterval(this.cardCheckHandle);
                    }
                } catch {
                    clearInterval(this.cardCheckHandle);
                }
            },
            selectMainPronouns(pronouns) {
                const best = {}
                for (let {value: pronoun, opinion} of pronouns) {
                    const opinionValue = opinions[opinion]?.value || 0;
                    if (best[opinionValue] === undefined) {
                        best[opinionValue] = [];
                    }
                    best[opinionValue].push(pronoun);
                }

                if (!Object.keys(best).length) { return []; }

                const bestKey = Math.max(...Object.keys(best));

                return bestKey >= 0 ? best[bestKey].slice(0, 3) : [];
            },
            async impersonate() {
                const { token } = await this.$axios.$get(`/admin/impersonate/${encodeURIComponent(this.username)}`);
                this.$cookies.set('impersonator', this.$cookies.get('token'));
                this.$cookies.set('token', token);
                await this.$router.push('/' + this.config.user.route);
                setTimeout(() => window.location.reload(), 500);
            },
        },
        head() {
            return head({
                title: `@${this.username}`,
                description: this.profile ? this.profile.description : null,
                banner: `api/banner/@${this.username}.png`,
                noindex: true,
            });
        },
    }
</script>

<style lang="scss" scoped>
    @import "assets/variables";

    $aside-margin: 2 * $spacer;
    @include media-breakpoint-up('xxl') {
        aside {
            position: absolute;
            top: 0;
            left: calc(100% + #{$aside-margin});
            width: min(300px, calc((100vw - #{$container-width}) / 2 - #{$aside-margin}));
        }

        .aside-home {
            margin-top: 164px;
        }
    }

    .list-group-flare > :first-child {
        border-top: 3px solid $primary;
    }
</style>
