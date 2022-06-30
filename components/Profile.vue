<template>
    <div>
        <div class="mb-3 d-flex justify-content-between flex-column flex-md-row">
            <div class="mw-50">
                <div class="text-nowrap d-flex align-items-center">
                    <Avatar :user="user" class="me-3"/>
                    <div>
                        <h2>
                            @{{user.username}}
                        </h2>
                        <p v-if="profile.teamName || profile.footerName" class="mb-2">
                            <nuxt-link :to="`/${config.contact.team.route}`" class="badge bg-primary text-white">
                                <Icon v="collective-logo.svg" class="inverted"/>
                                <T>contact.team.member</T>
                            </nuxt-link>
                        </p>
                    </div>
                </div>
            </div>
            <div class="flex-grow-1 text-lg-end">
                <slot></slot>
            </div>
        </div>

        <section class="row">
            <div v-if="hasDescriptionColumn" :class="['col-12', manyFlagsLayout ? '' : 'col-lg-6']">
                <p v-for="line in profile.description.split('\n')" class="mb-1">
                    <Twemoji><Spelling escape :text="line"/></Twemoji>
                </p>
                <p v-if="profile.age && profile.age >= minAge">
                    <Icon v="birthday-cake"/>
                    {{ profile.age }}
                </p>
            </div>

            <div v-if="profile.flags.length || Object.keys(profile.customFlags).length" :class="['col-12', manyFlagsLayout ? '' : 'col-lg-6']">
                <ul class="list-inline">
                    <li v-for="flag in profile.flags" v-if="allFlags[flag]" class="list-inline-item p-1">
                        <Flag :name="flag.startsWith('-') ? allFlags[flag] : $translateForPronoun(allFlags[flag], mainPronoun)"
                              :alt="allFlags[flag]"
                              :img="`/flags/${flag}.png`"
                              :terms="terms || []"
                              :asterisk="flagsAsterisk.includes(flag)"
                        />
                    </li>
                    <li v-for="(desc, flag) in profile.customFlags" class="list-inline-item p-1">
                        <Flag :name="desc"
                              :alt="desc"
                              :img="buildImageUrl(flag, 'flag')"
                              :terms="terms|| []"
                              custom/>
                    </li>
                </ul>
            </div>
        </section>

        <section class="row">
            <div v-if="Object.keys(profile.names).length" :class="['col-6', mainRowCount === 3 ? 'col-lg-4' : 'col-lg-6']">
                <h3>
                    <Icon v="signature"/>
                    <T>profile.names</T>
                </h3>

                <ul class="list-unstyled">
                    <li v-for="(opinion, name) in profile.names"><Opinion :word="convertName(name)" :opinion="opinion" :escape="false"/></li>
                </ul>
            </div>
            <div v-if="Object.keys(profile.pronouns).length" :class="['col-6', mainRowCount === 3 ? 'col-lg-4' : 'col-lg-6']">
                <h3>
                    <Icon v="tags"/>
                    <T>profile.pronouns</T>
                </h3>

                <ul class="list-unstyled">
                    <li v-for="{link, pronoun, opinion} in pronounOpinions">
                        <Opinion :word="typeof pronoun === 'string' ? pronoun : pronoun.name(glue)" :opinion="opinion" :link="`/${link}`"/>
                    </li>
                </ul>
            </div>
            <div v-if="profile.links.length" :class="['col-12', mainRowCount === 3 ? 'col-lg-4' : 'col-lg-6']">
                <h3>
                    <Icon v="link"/>
                    <T>profile.links</T>
                </h3>

                <ul class="list-unstyled">
                    <li v-for="link in profile.links">
                        <ProfileLink :link="link" :expand="expandLinks" :verifiedLinks="profile.verifiedLinks || {}"/>
                    </li>
                </ul>
            </div>
        </section>

        <section class="clearfix" v-if="Object.values(profile.words).map(w => Object.keys(w).length).reduce((a, b) => a + b, 0) > 0">
            <h3>
                <Icon v="scroll-old"/>
                <T>profile.words</T>
            </h3>

            <div class="row">
                <div v-for="group in profile.words" v-if="Object.keys(group).length" class="col-6 col-lg-3">
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
    import spelling from "../plugins/spelling";

    export default {
        mixins: [ spelling ],
        props: {
            user: { required: true },
            profile: { required: true },
            terms: { 'default': null },
            expandLinks: { type: Boolean },
        },
        data() {
            return {
                allFlags: process.env.FLAGS,
                glue: ' ' + this.$t('pronouns.or') + ' ',
                minAge: parseInt(process.env.MIN_AGE),
                flagsAsterisk: process.env.FLAGS_ASTERISK,
            };
        },
        computed: {
            pronounOpinions() {
                const pronounOpinions = [];
                for (let pronoun in this.profile.pronouns) {
                    if (!this.profile.pronouns.hasOwnProperty(pronoun)) { continue; }

                    let link = pronoun
                        .trim()
                        .replace(new RegExp('^' + this.$base), '')
                        .replace(new RegExp('^' + this.$base.replace(/^https?:\/\//, '')), '')
                        .replace(new RegExp('^/'), '');

                    try {
                        let link = decodeURIComponent(link);
                    } catch {
                        continue;
                    }

                    if (!link.startsWith(':')) {
                        link = link.toLowerCase();
                    }

                    const linkNorm = link.toLowerCase();
                    if (linkNorm === this.config.pronouns.any
                        || linkNorm.startsWith(this.config.pronouns.any + ':')
                        || (this.config.pronouns.null && this.config.pronouns.null.routes && this.config.pronouns.null.routes.includes(linkNorm))
                        || (this.config.pronouns.mirror && this.config.pronouns.mirror.route === linkNorm)
                    ) {
                        pronounOpinions.push({
                            link,
                            pronoun: link.replace(/:+/g, ' '),
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
                    if (opinion === 3) {
                        opinion = 0.5;
                    }
                    if (opinion > mainOpinion) {
                        mainPronoun = pronoun;
                        mainOpinion = opinion;
                    }
                }

                return mainPronoun;
            },
            countFlags() {
                return this.profile.flags.length + Object.keys(this.profile.customFlags).length;
            },
            manyFlagsLayout() {
                return this.countFlags > 36 || this.countFlags === 0 || !this.hasDescriptionColumn;
            },
            hasDescriptionColumn() {
                return (this.profile.age && this.profile.age > this.minAge)
                    || this.profile.description.trim().length
                    || this.profile.team;
            },
            mainRowCount() {
                let c = 0;
                if (Object.keys(this.profile.names).length) { c++; }
                if (Object.keys(this.profile.pronouns).length) { c++; }
                if (this.profile.links.length) { c++; }
                return c;
            }
        },
    };
</script>

<style lang="scss" scoped>
    .avatar {
        width: 100%;
        max-width: 5rem;
        max-height: 5rem;
    }

    .mw-50 {
        min-width: 50%;
    }
</style>
