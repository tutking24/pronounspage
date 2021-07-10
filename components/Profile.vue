<template>
    <div>
        <div class="mb-3 d-flex justify-content-between flex-column flex-md-row">
            <h2 class="text-nowrap">
                <Avatar :user="profile"/>
                @{{profile.username}}
            </h2>
            <div class="flex-grow-1 text-lg-end">
                <slot></slot>
            </div>
        </div>

        <section v-if="profile.age || profile.description.trim().length || profile.team">
            <p v-if="profile.team" class="mb-2">
                <nuxt-link :to="`/${config.contact.team.route}`" class="badge bg-primary text-white">
                    <Icon v="collective-logo.svg" class="inverted"/>
                    <T>contact.team.member</T>
                </nuxt-link>
            </p>
            <p v-for="line in profile.description.split('\n')" class="mb-1">
                <Spelling escape :text="line"/>
            </p>
            <p v-if="profile.age">
                <Icon v="birthday-cake"/>
                {{ profile.age }}
            </p>
        </section>

        <section v-if="profile.flags.length || Object.keys(profile.customFlags).length">
            <ul class="list-inline">
                <li v-for="flag in profile.flags" v-if="allFlags[flag]" class="list-inline-item pr-2">
                    <Flag :name="flag.startsWith('-') ? allFlags[flag] : $translateForPronoun(allFlags[flag], mainPronoun)"
                          :alt="allFlags[flag]"
                          :img="`/flags/${flag}.png`"
                          :terms="terms || []"/>
                </li>
                <li v-for="(desc, flag) in profile.customFlags" class="list-inline-item pr-2">
                    <Flag :name="desc"
                          :alt="desc"
                          :img="buildImageUrl(flag, 'flag')"
                          :terms="terms|| []"
                          custom/>
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
</template>

<script>
    import { pronouns } from "~/src/data";
    import { buildPronoun } from "../src/buildPronoun";

    export default {
        props: {
            profile: { required: true },
            terms: { 'default': null },
        },
        data() {
            return {
                allFlags: process.env.FLAGS,
                glue: ' ' + this.$t('pronouns.or') + ' ',
            }
        },
        computed: {
            pronounOpinions() {
                const pronounOpinions = [];
                for (let pronoun in this.profile.pronouns) {
                    if (!this.profile.pronouns.hasOwnProperty(pronoun)) { continue; }

                    let link = decodeURIComponent(
                        pronoun
                            .trim()
                            .replace(new RegExp('^' + this.$base), '')
                            .replace(new RegExp('^' + this.$base.replace(/^https?:\/\//, '')), '')
                            .replace(new RegExp('^/'), '')
                    );
                    if (!link.startsWith(':')) {
                        link = link.toLowerCase();
                    }

                    if (link === this.config.pronouns.any || link === this.config.pronouns.avoiding) {
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
    };
</script>

<style lang="scss" scoped>
    .avatar {
        width: 100%;
        max-width: 5rem;
        max-height: 5rem;
    }
</style>
