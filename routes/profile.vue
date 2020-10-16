<template>
    <div class="container">
        <template v-if="profile">
            <h2>
                <Avatar :user="profile"/>
                @{{username}}
            </h2>

            <section v-if="profile.description.trim().length">
                <p v-for="line in profile.description.split('\n')" class="mb-1">
                    {{ line }}
                </p>
            </section>

            <section v-if="profile.age || Object.keys(profile.links).length">
                <ul class="list-inline">
                    <li v-if="profile.age" class="list-inline-item">
                        <Icon v="birthday-cake"/>
                        {{ profile.age }}
                    </li>
                    <li v-for="link in profile.links" class="list-inline-item">
                        <ProfileLink :link="link"/>
                    </li>
                </ul>
            </section>

            <section v-if="Object.keys(profile.flags).length">
                <ul class="list-inline">
                    <li v-for="(name, flag) in profile.flags" class="list-inline-item">
                        <Flag :name="name" :src="`/flags/${flag}.png`"/>
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
                        <li v-for="(opinion, pronoun) in profile.pronouns"><Opinion :word="buildTemplate(pronoun).name('')" :opinion="opinion" :link="`/${pronoun}`"/></li>
                    </ul>
                </div>
            </section>

            <section>
                <h3>
                    <Icon v="scroll-old"/>
                    <T>profile.words</T>
                </h3>

                <div class="d-flex">
                    <div v-for="group in profile.words" v-if="Object.keys(profile.words).length" class="w-25">
                        <ul class="list-unstyled">
                            <li v-for="(opinion, word) in group"><Opinion :word="word" :opinion="opinion"/></li>
                        </ul>
                    </div>
                </div>
            </section>
        </template>
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
            }
        },
        async asyncData({ app, route }) {
            return {
                profiles: await app.$axios.$get(`/profile/get/${route.params.pathMatch}`),
            };
        },
        methods: {
            buildTemplate(link) {
                return buildTemplate(templates, link);
            },
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
