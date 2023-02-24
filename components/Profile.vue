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
                        <p v-if="user.team || profile.teamName || profile.footerName" class="mb-2">
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
                <div v-if="profile.description" class="mb-3">
                    <p v-for="line in profile.description.split('\n')" class="mb-1">
                        <Spelling escape :text="line"/>
                    </p>
                </div>
                <p v-if="profile.age && profile.age >= minAge">
                    <Icon v="birthday-cake"/>
                    <T>profile.birthday</T><T>quotation.colon</T>
                    {{ profile.age }}
                </p>
                <Timezone v-if="profile.timezone" :value="profile.timezone" :static="static"/>
            </div>

            <div v-if="profile.flags.length || profile.customFlags.length" :class="['col-12', manyFlagsLayout ? '' : 'col-lg-6']">
                <ClientOnly>
                <ul class="list-inline">
                    <li v-for="flag in profile.flags" v-if="allFlags[flag]" class="list-inline-item p-1">
                        <Flag :termkey="allFlags[flag]"
                              :name="flag.startsWith('-') ? allFlags[flag] : $translateForPronoun(allFlags[flag], mainPronoun)"
                              :alt="$t('flags_alt.' + flag.replace(/'/g, '*').replace(/ /g, '_'))"
                              :img="`/flags/${flag}.png`"
                              :terms="terms || []"
                              :asterisk="flagsAsterisk.includes(flag)"
                        />
                    </li>
                    <li v-for="{value: flag, name, description, alt, link} in profile.customFlags" class="list-inline-item p-1">
                        <Flag :termkey="name"
                              :name="name"
                              :alt="alt || ''"
                              :img="buildImageUrl(flag, 'flag')"
                              :terms="terms|| []"
                              custom
                              :description="description"
                              :customlink="link"
                        />
                    </li>
                </ul>
                </ClientOnly>
            </div>
        </section>

        <section class="row">
            <div v-if="profile.names.length" :class="['col-6', mainRowCount === 3 ? 'col-lg-4' : 'col-lg-6']">
                <h3>
                    <Icon v="signature"/>
                    <T>profile.names</T>
                </h3>

                <ExpandableList :values="profile.names" :limit="16" class="list-unstyled" :static="static" :expand="expandLinks">
                    <template v-slot="s">
                        <Opinion :word="convertName(s.el.value)" :opinion="s.el.opinion" :escape="false" :customOpinions="profile.opinions"/>
                    </template>
                </ExpandableList>
            </div>
            <div v-if="profile.pronouns.length" :class="['col-6', mainRowCount === 3 ? 'col-lg-4' : 'col-lg-6']">
                <h3>
                    <Icon v="tags"/>
                    <T>profile.pronouns</T>
                </h3>

                <ExpandableList :values="pronounOpinions" :limit="16" class="list-unstyled" :static="static" :expand="expandLinks">
                    <template v-slot="s">
                        <Opinion :word="typeof s.el.pronoun === 'string' ? s.el.pronoun : s.el.pronoun.name(glue)" :opinion="s.el.opinion" :link="`/${s.el.link}`" :customOpinions="profile.opinions"/>
                    </template>
                </ExpandableList>
            </div>
            <div v-if="profile.links.length" :class="['col-12', mainRowCount === 3 ? 'col-lg-4' : 'col-lg-6']">
                <h3>
                    <Icon v="link"/>
                    <T>profile.links</T>
                </h3>

                <ExpandableList :values="profile.links" :limit="16" class="list-unstyled" :static="static" :expand="expandLinks">
                    <template v-slot="s">
                        <ProfileLink :link="s.el" :expand="static" :verifiedLinks="profile.verifiedLinks || {}" :metadata="profile.linksMetadata[s.el]"/>
                    </template>
                </ExpandableList>
            </div>
        </section>

        <section class="clearfix" v-if="profile.words.map(w => w.values.length).reduce((a, b) => a + b, 0) > 0">
            <h3>
                <Icon v="scroll-old"/>
                <T>profile.words</T>
            </h3>

            <div class="row">
                <div v-for="column in profile.words" v-if="column.values.length" class="col-6 col-lg-3">
                    <h4 v-if="column.header" class="h6">{{ column.header }}</h4>

                    <ExpandableList :values="column.values" :limit="16" class="list-unstyled" :static="static" :expand="expandLinks">
                        <template v-slot="s">
                            <Opinion :word="s.el.value" :opinion="s.el.opinion" :customOpinions="profile.opinions"/>
                        </template>
                    </ExpandableList>
                </div>
            </div>
        </section>

        <section class="clearfix" v-if="profile.circle.length > 0 && !static">
            <h3>
                <Icon v="heart-circle"/>
                <T>profile.circles.header</T>
            </h3>
            <div class="row">
                <div v-for="connection in profile.circle" class="col-12 col-lg-4 pt-2 pb-2">
                    <Avatar :user="connection" :src="connection.avatar" class="float-start me-2" dsize="4rem"/>
                    <h4>
                        <LocaleLink :link="`/@${connection.username}`" :locale="connection.locale">
                            @{{connection.username}}
                        </LocaleLink>
                        <Tooltip v-if="connection.circleMutual" :text="$t('profile.circles.mutual')" class="small">
                            <Icon v="shield-check" set="s"/>
                        </Tooltip>
                    </h4>
                    <p>{{connection.relationship}}</p>
                </div>
            </div>
        </section>

        <section>
            <OpinionLegend :custom="profile.opinions"/>
        </section>
    </div>
</template>

<script>
    import { pronouns } from "~/src/data";
    import { buildPronoun } from "../src/buildPronoun";
    import spelling from "../plugins/spelling";
    import opinions from '../src/opinions';
    import ClientOnly from 'vue-client-only'

    export default {
        components: { ClientOnly },
        mixins: [ spelling ],
        props: {
            user: { required: true },
            profile: { required: true },
            terms: { 'default': null },
            static: { type: Boolean },
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
                for (let {value: pronoun, opinion} of this.profile.pronouns) {
                    let link = pronoun
                        .trim()
                        .replace(new RegExp('^' + this.$base), '')
                        .replace(new RegExp('^' + this.$base.replace(/^https?:\/\//, '')), '')
                        .replace(new RegExp('^/'), '');

                    try {
                        link = decodeURIComponent(link);
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
                            opinion,
                        });
                        continue;
                    }

                    const pronounEntity = buildPronoun(pronouns, link);

                    if (pronounEntity) {
                        pronounOpinions.push({
                            link,
                            pronoun: pronounEntity,
                            opinion,
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
                    const opinionValue = opinions[opinion]?.value || 0;
                    if (opinionValue > mainOpinion) {
                        mainPronoun = pronoun;
                        mainOpinion = opinionValue;
                    }
                }

                return mainPronoun;
            },
            countFlags() {
                return this.profile.flags.length + this.profile.customFlags.length;
            },
            manyFlagsLayout() {
                return this.countFlags > 36 || this.countFlags === 0 || !this.hasDescriptionColumn;
            },
            hasDescriptionColumn() {
                return (this.profile.age && this.profile.age > this.minAge)
                    || this.profile.description.trim().length
                    || this.profile.team
                    || this.profile.timezone
                ;
            },
            mainRowCount() {
                let c = 0;
                if (this.profile.names.length) { c++; }
                if (this.profile.pronouns.length) { c++; }
                if (this.profile.links.length) { c++; }
                return c;
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

    .mw-50 {
        min-width: 50%;
    }
</style>
