<template>
    <MustLogin v-if="!$user()"/>
    <div v-else>
        <div class="mb-3 d-flex justify-content-between flex-column flex-md-row">
            <h2 class="text-nowrap">
                <Avatar :user="$user()"/>
                @{{ $user().username }}
            </h2>
            <div>
                <nuxt-link :to="`/@${$user().username}`" class="btn btn-outline-primary btn-sm">
                    <Icon v="id-card"/>
                    <T>profile.show</T>
                </nuxt-link>
            </div>
        </div>

        <form @submit.prevent="save" :class="[saving ? 'saving' : '']">
            <div v-if="$isGranted('users')" class="border border-primary rounded p-4">
                <h3 class="h4 mb-3">
                    <Icon v="user-cog"/>
                    Admin section
                </h3>

                <p class="small text-muted mb-0">
                    This will be shown on the “Team” page.
                    If you leave it empty, you won't show up there (for this language version).
                    You can use a different display name in different language versions.
                </p>

                <div class="form-group">
                    <label for="teamName">Team page display name:</label>
                    <input class="form-control" name="teamName" maxlength="36" v-model="teamName"/>
                </div>

                <hr/>

                <p class="small text-muted mb-0">
                    If you feel that you've contributed to this language version enough to get credited in the footer
                    (not saying how much that is, that's on you to decide 😉),
                    then add your name and areas here (in the local language!).
                    The team as a whole will be credited in the footer either way.
                </p>

                <div class="form-group">
                    <label for="footerName">Footer display name:</label>
                    <input class="form-control" name="footerName" maxlength="36" v-model="footerName"/>
                </div>

                <div class="form-group">
                    <label for="footerAreas">Areas responsible for / contributing to:</label>
                    <ListInput v-model="footerAreas"/>
                </div>
            </div>

            <section>
                <OpinionLegend/>
            </section>

            <div class="form-group">
                <h3 class="h4">
                    <Icon v="signature"/>
                    <T>profile.names</T>
                </h3>
                <OpinionListInput v-model="names"/>
            </div>

            <div class="form-group">
                <h3 class="h4">
                    <Icon v="link"/>
                    <T>profile.pronouns</T>
                </h3>
                <p class="small text-muted mb-0">
                    <T>profile.pronounsInfo</T>
                </p>
                <OpinionListInput v-model="pronouns" :validation="validatePronoun"/>
            </div>

            <div class="form-group">
                <h3 class="h4">
                    <Icon v="comment-edit"/>
                    <T>profile.description</T>
                </h3>
                <textarea class="form-control form-control-sm" v-model="description" maxlength="256" rows="4"/>
            </div>

            <div class="form-group">
                <h3 class="h4">
                    <Icon v="flag"/>
                    <T>profile.flags</T>
                </h3>
                <p class="small text-muted mb-0">
                    <T>profile.flagsInfo</T>
                </p>
                <ButtonList v-model="flags" :options="allFlags" v-slot="s">
                    <Flag :name="s.desc.split('|')[0]" :alt="s.desc.split('|')[1]" :img="`/flags/${s.v}.png`"/>
                </ButtonList>
            </div>

            <details class="form-group border rounded" open>
                <summary class="px-3 py-2 small">
                    <T>profile.flagsCustom</T>
                </summary>
                <div class="border-top">
                    <ImageWidgetRich v-model="customFlags"/>
                </div>
            </details>

            <div class="form-group">
                <h3 class="h4">
                    <Icon v="link"/>
                    <T>profile.links</T>
                </h3>
                <ListInput v-model="links" v-slot="s">
                    <input v-model="s.val" type="url" class="form-control" @keyup="s.update(s.val)" required/>
                </ListInput>
            </div>

            <div class="form-group">
                <h3 class="h4">
                    <Icon v="birthday-cake"/>
                    <T>profile.birthday</T>
                </h3>
                <p class="small text-muted mb-0">
                    <T>profile.birthdayInfo</T>
                </p>
                <input type="date" class="form-control form-control-sm" v-model="birthday"/>
            </div>

            <div class="form-group">
                <h3 class="h4">
                    <Icon v="scroll-old"/>
                    <T>profile.words</T>
                </h3>
                <template v-for="i in [0, 1, 2, 3]">
                    <h4 class="h5">
                        <T>profile.column</T> {{i + 1}}
                    </h4>
                    <OpinionListInput v-model="words[i]" group="words"/>
                </template>
            </div>

            <button class="btn btn-primary w-100" type="submit">
                <Icon v="save"/>
                <T>profile.editor.save</T>
            </button>
        </form>
    </div>
</template>

<script>
    import {head, dictToList, listToDict, buildList, buildDict} from "../src/helpers";
    import { pronouns } from "~/src/data";
    import { buildPronoun } from "../src/buildPronoun";
    import config from '../data/config.suml';

    const defaultWords = config.profile.defaultWords.map(c => buildList(function* () {
        for (let word of c) {
            yield {key: word, value: 0};
        }
    }))

    export default {
        data() {
            return {
                saving: false,
            };
        },
        async asyncData({ app, store }) {
            if (!store.state.user) {
                return {};
            }

            const profiles = await app.$axios.$get(`/profile/get/${encodeURIComponent(store.state.user.username)}`, { headers: {
                authorization: 'Bearer ' + store.state.token,
            } });

            for (let locale in profiles) {
                if (!profiles.hasOwnProperty(locale)) {
                    continue;
                }
                if (locale === app.context.env.LOCALE) {
                    const profile = profiles[locale];
                    return {
                        names: dictToList(profile.names),
                        pronouns: dictToList(profile.pronouns),
                        description: profile.description,
                        birthday: profile.birthday,
                        links: Object.keys(profile.links).length ? profile.links : [],
                        flags: profile.flags,
                        customFlags: profile.customFlags,
                        words: profile.words.map(x => dictToList(x)),
                        teamName: profile.teamName,
                        footerName: profile.footerName,
                        footerAreas: profile.footerAreas,
                    };
                }
            }

            for (let locale in profiles) {
                if (!profiles.hasOwnProperty(locale)) {
                    continue;
                }
                const profile = profiles[locale];
                return {
                    names: dictToList(profile.names),
                    pronouns: [],
                    description: '',
                    birthday: profile.birthday,
                    links: Object.keys(profile.links).length ? profile.links : [],
                    flags: profile.flags.filter(f => !f.startsWith('-')),
                    customFlags: profile.customFlags,
                    words: defaultWords,
                    teamName: profile.teamName,
                    footerName: profile.footerName,
                    footerAreas: [],
                };
            }

            return {
                names: [],
                pronouns: [],
                description: '',
                birthday: null,
                links: [],
                flags: [],
                customFlags: {},
                words: defaultWords,
                teamName: '',
                footerName: '',
                footerAreas: [],
            };
        },
        mounted() {
            if (process.client && !this.$user()) {
                window.sessionStorage.setItem('after-login', window.location.pathname);
                this.$router.push('/' + this.config.user.route);
            }
        },
        methods: {
            async save() {
                this.saving = true;
                await this.$axios.$post(`/profile/save`, {
                    names: listToDict(this.names),
                    pronouns: listToDict(this.pronouns),
                    description: this.description,
                    birthday: this.birthday,
                    links: [...this.links],
                    flags: [...this.flags],
                    customFlags: {...this.customFlags},
                    words: this.words.map(x => listToDict(x)),
                    teamName: this.teamName,
                    footerName: this.footerName,
                    footerAreas: this.footerAreas,
                });
                this.saving = false;
                this.$router.push(`/@${this.$user().username}`)
            },
            normalisePronoun(pronoun) {
                return decodeURIComponent(
                    pronoun
                        .toLowerCase()
                        .trim()
                        .replace(new RegExp('^' + this.$base), '')
                        .replace(new RegExp('^' + this.$base.replace(/^https?:\/\//, '')), '')
                        .replace(new RegExp('^/'), '')
                );
            },
            normaliseAndBuildPronoun(pronoun) {
                return buildPronoun(pronouns, this.normalisePronoun(pronoun));
            },
            validatePronoun(pronoun) {
                pronoun = this.normalisePronoun(pronoun);
                return pronoun === this.config.pronouns.any || buildPronoun(pronouns, pronoun)
                    ? null
                    : 'profile.pronounsNotFound'
            },
        },
        computed: {
            mainPronoun() {
                let mainPronoun = buildPronoun(pronouns, this.config.profile.flags.defaultPronoun);
                let mainOpinion = -1;
                for (let {key: pronoun, value: opinion} of this.pronouns) {
                    if (opinion === 2) {
                        opinion = 0.5;
                    }
                    if (opinion > mainOpinion) {
                        const p = this.normaliseAndBuildPronoun(pronoun);
                        if (p) {
                            mainPronoun = p;
                            mainOpinion = opinion;
                        }
                    }
                }

                return mainPronoun;
            },
            allFlags() {
                const that = this;
                const flags = buildList(function*() {
                    for (let key in process.env.FLAGS) {
                        if (!process.env.FLAGS.hasOwnProperty(key)) { continue; }
                        yield [
                            key,
                            (key.startsWith('-') ? process.env.FLAGS[key] : that.$translateForPronoun(process.env.FLAGS[key], that.mainPronoun))
                                + '|' + process.env.FLAGS[key]
                        ];
                    }
                });

                flags.sort((a, b) => a[1].localeCompare(b[1]));

                return buildDict(function *() {
                    for (let [key, display] of flags) {
                        yield [key, display];
                    }
                });
            },
        },
        head() {
            return head({
                title: this.$t('profile.editor.header'),
            });
        },
    }
</script>

<style lang="scss" scoped>
    .avatar {
        width: 100%;
        max-width: 5rem;
        max-height: 5rem;
    }
    .saving {
        opacity: .5;
    }
</style>
