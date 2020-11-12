<template>
    <div v-if="profile" class="container">
        <div class="mb-3 d-flex justify-content-between flex-column flex-md-row">
            <h2 class="text-nowrap">
                <Avatar :user="profile"/>
                @{{username}}
            </h2>
            <div>
                <nuxt-link v-if="$user() && $user().username === username" to="/editor"
                           class="btn btn-outline-primary btn-sm mb-2"
                >
                    <Icon v="edit"/>
                    <T>profile.edit</T>
                </nuxt-link>
                <div class="list-group" v-if="Object.keys(profiles).length > 1">
                    <LocaleLink v-for="(options, locale) in locales" :key="locale" v-if="profiles[locale] !== undefined"
                                :locale="locale" :link="`/@${username}`"
                                :class="['list-group-item list-group-item-action small px-3 py-2 text-center', locale === config.locale ? 'active disabled' : '']">
                        {{options.name}}
                    </LocaleLink>
                </div>
            </div>
        </div>

        <section v-if="profile.age ||profile.description.trim().length">
            <p v-for="line in profile.description.split('\n')" class="mb-1">
                {{ line }}
            </p>
            <p v-if="profile.age">
                <Icon v="birthday-cake"/>
                {{ profile.age }}
            </p>
        </section>

        <section v-if="profile.flags.length">
            <ul class="list-inline">
                <li v-for="flag in profile.flags" class="list-inline-item pr-2">
                    <Flag :name="allFlags[flag]" :src="`/flags/${flag}.png`"/>
                </li>
            </ul>
        </section>

        <section v-if="profile.links.length">
            <ul class="list-inline">
                <li v-for="link in profile.links" class="list-inline-item pr-2">
                    <ProfileLink :link="link"/>
                </li>
            </ul>
        </section>

        <section class="d-flex">
            <div class="w-50" v-if="Object.keys(profile.names).length">
                <h3>
                    <Icon v="signature"/>
                    <T>profile.names</T>
                </h3>

                <ul class="list-unstyled">
                    <li v-for="(opinion, name) in profile.names"><Opinion :word="name" :opinion="opinion"/></li>
                </ul>
            </div>
            <div class="w-50" v-if="Object.keys(profile.pronouns).length">
                <h3>
                    <Icon v="tags"/>
                    <T>profile.pronouns</T>
                </h3>

                <ul class="list-unstyled">
                    <li v-for="{link, pronoun, opinion} in pronounOpinions">
                        <Opinion :word="pronoun.name(glue)" :opinion="opinion" :link="`/${link}`"/>
                    </li>
                </ul>
            </div>
        </section>

        <section>
            <h3>
                <Icon v="scroll-old"/>
                <T>profile.words</T>
            </h3>

            <div>
                <div v-for="group in profile.words" v-if="Object.keys(profile.words).length" class="float-left w-50 w-md-25">
                    <ul class="list-unstyled">
                        <li v-for="(opinion, word) in group"><Opinion :word="word" :opinion="opinion"/></li>
                    </ul>
                </div>
            </div>
        </section>
    </div>
    <div v-else-if="Object.keys(profiles).length" class="container">
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
    import { pronouns } from "~/src/data";
    import { buildPronoun } from "../src/buildPronoun";

    export default {
        data() {
             return {
                username: this.$route.params.pathMatch,
                profiles: {},
                glue: ' ' + this.$t('pronouns.or') + ' ',
                allFlags: process.env.FLAGS,
            }
        },
        async asyncData({ app, route }) {
            return {
                profiles: await app.$axios.$get(`/profile/get/${encodeURIComponent(route.params.pathMatch)}`),
            };
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
            pronounOpinions() {
                const pronounOpinions = [];
                for (let pronoun in this.profile.pronouns) {
                    if (!this.profile.pronouns.hasOwnProperty(pronoun)) { continue; }

                    const link = pronoun.replace(new RegExp('^' + this.$base), '').replace(new RegExp('^/'), '');
                    const pronounEntity = buildPronoun(pronouns, link);

                    if (pronounEntity) {
                        pronounOpinions.push({
                            link,
                            pronoun: pronounEntity,
                            opinion: this.profile.pronouns[pronoun],
                        });
                    }
                }
                return pronounOpinions;
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
    @import "assets/style";

    .avatar {
        width: 100%;
        max-width: 5rem;
        max-height: 5rem;
    }

    .list-group-item-hoverable {
        &:hover {
            color: $primary;
            border-left: 3px solid $primary;
            padding-left: calc(#{$list-group-item-padding-x} - 2px);
        }
    }
</style>
