<template>
    <NotFound v-if="!profile"/>
    <div v-else class="container">
        <div class="mb-3 d-flex justify-content-between flex-column flex-md-row">
            <h2 class="text-nowrap">
                <Avatar :user="profile"/>
                @{{username}}
            </h2>
            <div>
                <nuxt-link v-if="$user() && $user().username === username" :to="`/${config.user.profileEditorRoute}`"
                           class="btn btn-outline-primary btn-sm"
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

        <section v-if="profile.links.length">
            <ul class="list-inline">
                <li v-for="link in profile.links" class="list-inline-item pr-2">
                    <ProfileLink :link="link"/>
                </li>
            </ul>
        </section>

        <section v-if="profile.flags.length">
            <ul class="list-inline">
                <li v-for="flag in profile.flags" class="list-inline-item pr-2">
                    <Flag :name="allFlags[flag]" :src="`/flags/${flag}.png`"/>
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
                    <li v-for="{link, template, opinion} in pronounTemplates">
                        <Opinion :word="template.name(glue)" :opinion="opinion" :link="`/${link}`"/>
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
</template>

<script>
    import { head } from "../src/helpers";
    import { templates } from "~/src/data";
    import { buildTemplate } from "../src/buildTemplate";

    export default {
        data() {
            return {
                username: this.$route.params.pathMatch,
                profiles: {},
                glue: ' ' + this.$t('template.or') + ' ',
                allFlags: process.env.FLAGS,
            }
        },
        async asyncData({ app, route }) {
            return {
                profiles: await app.$axios.$get(`/profile/get/${route.params.pathMatch}`),
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
            pronounTemplates() {
                const pronounTemplates = [];
                for (let pronoun in this.profile.pronouns) {
                    if (!this.profile.pronouns.hasOwnProperty(pronoun)) { continue; }

                    const link = pronoun.replace(new RegExp('^' + process.env.BASE_URL), '').replace(new RegExp('^/'), '');
                    const template = buildTemplate(templates, link);

                    if (template) {
                        pronounTemplates.push({
                            link,
                            template,
                            opinion: this.profile.pronouns[pronoun],
                        });
                    }
                }
                return pronounTemplates;
            },
        },
        head() {
            return head({
                title: `@${this.username}`,
                banner: `banner/@${this.username}.png`,
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
</style>
