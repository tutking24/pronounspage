<template>
    <div v-if="profile">
        <div class="mb-3 d-flex justify-content-between flex-column flex-md-row">
            <h2 class="text-nowrap">
                <Avatar :user="profile"/>
                @{{username}}
            </h2>
            <div>
                <div class="text-end">
                    <nuxt-link v-if="$user() && $user().username === username" to="/editor"
                               class="btn btn-outline-primary btn-sm mb-2"
                    >
                        <Icon v="edit"/>
                        <T>profile.edit</T>
                    </nuxt-link>
                </div>
                <div v-if="Object.keys(profiles).length > 1" class="locale-list">
                    <a :href="`https://pronouns.page/@${username}`" v-if="$user() && $user().username === username"
                       class="btn btn-outline-secondary btn-sm mb-1 me-1"
                    >
                        <Icon v="external-link"/>
                        pronouns.page/@{{username}}
                    </a>
                    <br/>
                    <LocaleLink v-for="(options, locale) in locales" :key="locale" v-if="profiles[locale] !== undefined"
                                :locale="locale" :link="`/@${username}`"
                                :class="['btn', locale === config.locale ? 'btn-primary disabled' : 'btn-outline-primary', 'btn-sm', 'mb-1 me-1']">
                        {{options.name}}
                    </LocaleLink>
                </div>
            </div>
        </div>

        <section v-if="profile.age ||profile.description.trim().length">
            <p v-for="line in profile.description.split('\n')" class="mb-1">
                <Spelling>{{ line }}</Spelling>
            </p>
            <p v-if="profile.age">
                <Icon v="birthday-cake"/>
                {{ profile.age }}
            </p>
        </section>

        <section v-if="profile.flags.length">
            <ul class="list-inline">
                <li v-for="flag in profile.flags" v-if="allFlags[flag]" class="list-inline-item pr-2">
                    <Flag :name="flag.startsWith('-') ? allFlags[flag] : $translateForPronoun(allFlags[flag], mainPronoun)" :alt="allFlags[flag]" :img="`/flags/${flag}.png`" :terms="terms"/>
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
                        <Opinion :word="typeof pronoun === 'string' ? pronoun : (pronoun.name(glue) + (pronoun.smallForm ? '/' + pronoun.morphemes[pronoun.smallForm] : ''))" :opinion="opinion" :link="`/${link}`"/>
                    </li>
                </ul>
            </div>
        </section>

        <section class="clearfix">
            <h3>
                <Icon v="scroll-old"/>
                <T>profile.words</T>
            </h3>

            <div>
                <div v-for="group in profile.words" v-if="Object.keys(profile.words).length" class="float-start w-50 w-md-25">
                    <ul class="list-unstyled">
                        <li v-for="(opinion, word) in group"><Opinion :word="word" :opinion="opinion"/></li>
                    </ul>
                </div>
            </div>
        </section>

        <section>
            <OpinionLegend/>
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
    import { pronouns } from "~/src/data";
    import { buildPronoun } from "../src/buildPronoun";

    export default {
        data() {
             return {
                profiles: {},
                glue: ' ' + this.$t('pronouns.or') + ' ',
                allFlags: process.env.FLAGS,
            }
        },
        async asyncData({ app, route }) {
            return {
                profiles: await app.$axios.$get(`/profile/get/${encodeURIComponent(route.params.pathMatch)}`),
                terms: await app.$axios.$get(`/terms`),
            };
        },
        computed: {
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

                    const link = decodeURIComponent(
                        pronoun
                            .toLowerCase()
                            .trim()
                            .replace(new RegExp('^' + this.$base), '')
                            .replace(new RegExp('^' + this.$base.replace(/^https?:\/\//, '')), '')
                            .replace(new RegExp('^/'), '')
                    );

                    if (link === this.config.pronouns.any) {
                        pronounOpinions.push({
                            link,
                            pronoun: link,
                            opinion: this.profile.pronouns[pronoun],
                        });
                        continue;
                    }

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
            mainPronoun() {
                let mainPronoun = buildPronoun(pronouns, this.config.profile.flags.defaultPronoun);
                let mainOpinion = -1;
                for (let {pronoun, opinion} of this.pronounOpinions) {
                    if (typeof pronoun === 'string') {
                        continue;
                    }
                    if (opinion === 2) {
                        opinion = 0.5;
                    }
                    if (opinion > mainOpinion) {
                        mainPronoun = pronoun;
                        mainOpinion = opinion;
                    }
                }

                return mainPronoun;
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

    .avatar {
        width: 100%;
        max-width: 5rem;
        max-height: 5rem;
    }

    .list-group-item-hoverable {
        &:hover {
            color: $primary;
            border-inline-start: 3px solid $primary;
            padding-inline-start: calc(#{$list-group-item-padding-x} - 2px);
        }
    }

    @include media-breakpoint-up('md', $grid-breakpoints) {
        .locale-list {
            max-width: 16rem;
            text-align: right;
        }
    }
</style>
