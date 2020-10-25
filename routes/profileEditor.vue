<template>
    <NotFound v-if="!$user()"/>
    <div v-else class="container">
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
                <OpinionListInput v-model="pronouns"/>
                <p class="small text-muted">
                    <T>profile.pronounsInfo</T>
                </p>
            </div>

            <div class="form-group">
                <h3 class="h4">
                    <Icon v="comment-edit"/>
                    <T>profile.description</T>
                </h3>
                <textarea class="form-control" v-model="description" maxlength="256" rows="4"/>
            </div>

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
                <input type="date" class="form-control" v-model="birthday"/>
                <p class="small text-muted">
                    <T>profile.birthdayInfo</T>
                </p>
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

            <button class="btn btn-primary btn-block" type="submit">
                <Icon v="save"/>
                <T>profile.editor.save</T>
            </button>
        </form>
    </div>
</template>

<script>
    import { head, dictToList, listToDict, buildList } from "../src/helpers";
    import { templates } from "~/src/data";
    import { buildTemplate } from "../src/buildTemplate";
    import config from '../data/config.suml';

    const defaultWords = config.user.profile.defaultWords.map(c => buildList(function* () {
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

            const profiles = await app.$axios.$get(`/profile/get/${store.state.user.username}`, { headers: {
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
                        flags: dictToList(profile.flags),
                        words: profile.words.map(x => dictToList(x)),
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
                    flags: dictToList(profile.flags),
                    words: defaultWords,
                };
            }

            return {
                names: [],
                pronouns: [],
                description: '',
                birthday: null,
                links: [],
                flags: [],
                words: defaultWords,
            };
        },
        methods: {
            buildTemplate(link) {
                return buildTemplate(templates, link);
            },
            async save() {
                this.saving = true;
                const response = await this.$axios.$post(`/profile/save/${this.config.locale}`, {
                    names: listToDict(this.names),
                    pronouns: listToDict(this.pronouns),
                    description: this.description,
                    birthday: this.birthday,
                    links: this.links,
                    flags: listToDict(this.flags),
                    words: this.words.map(x => listToDict(x)),
                }, { headers: this.$auth() });
                this.saving = false;
                this.$router.push(`/@${this.$user().username}`)
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
