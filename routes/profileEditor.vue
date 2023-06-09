<template>
    <Page>
    <MustLogin v-if="!$user()"/>
    <div v-else>
        <AdPlaceholder phkey="small-homepage"/>
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
            <TabsNav :tabs="['opinions', 'names', config.pronouns.enabled ? 'pronouns' : undefined, 'description', 'flags', 'links', 'birthday', 'timezone', 'words', 'circle', 'sensitive', $isGranted() ? 'admin' : undefined]"
                     pills showheaders navclass="mb-3 border-bottom-0">
                <template v-slot:admin-header>
                    <Icon v="user-cog"/>
                    Admin section
                </template>
                <template v-slot:admin>
                    <p class="small text-muted mb-0">
                        This will be shown on the “Team” page.
                        If you leave it empty, you won't show up there (for this language version).
                        You can use a different display name in different language versions.
                        Please only add yourself here, if you're actually working on <strong>this language version</strong>.
                    </p>

                    <div class="form-group">
                        <label for="teamName">Team page display name:</label>
                        <input class="form-control" name="teamName" maxlength="64" v-model="teamName"/>
                        <PropagateCheckbox field="teamName" :before="beforeChanges.teamName" :after="teamName" v-if="otherProfiles > 0" @change="propagateChanged"/>
                    </div>

                    <hr/>

                    <p class="small text-muted mb-0">
                        If you feel that you've contributed to this language version enough to get credited in the footer
                        (not saying how much that is, that's on you to decide 😉),
                        then add your name and areas here (in the local language!).
                        Please only add yourself here, if you're actually working on <strong>this language version</strong>.
                        The team as a whole will be credited in the footer either way.
                    </p>

                    <div class="form-group">
                        <label for="footerName">Footer display name:</label>
                        <input class="form-control" name="footerName" maxlength="64" v-model="footerName"/>
                        <PropagateCheckbox field="footerName" :before="beforeChanges.footerName" :after="footerName" v-if="otherProfiles > 0" @change="propagateChanged"/>
                    </div>

                    <div class="form-group">
                        <label for="footerAreas">Areas responsible for / contributing to:</label>
                        <ListInput v-model="footerAreas"/>
                    </div>

                    <template v-if="$te('contact.team.credentials')">
                        <hr/>

                        <p class="small text-muted mb-0">
                            This will be displayed on the team page in the "Credentials" section.
                            You might want to put here your full legal name here, but it's not required
                            (you can leave this field empty).
                        </p>

                        <div class="form-group">
                            <label for="credentials">Credentials:</label>
                            <ListInput v-model="credentials"/>
                        </div>

                        <div class="form-group">
                            <label for="credentials">Credentials level:</label>
                            <select v-model="credentialsLevel" class="form-select">
                                <option :value="null"></option>
                                <option :value="1">Higher education, but irrelevant field</option>
                                <option :value="2">Bachelor (not completed yet)</option>
                                <option :value="3">Bachelor</option>
                                <option :value="4">Master (not completed yet)</option>
                                <option :value="5">Master</option>
                                <option :value="6">PhD (not completed yet)</option>
                                <option :value="7">PhD</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="credentials">Name for credentials:</label>
                            <input v-model="credentialsName" class="form-control" placeholder="(not required)"/>
                        </div>
                    </template>
                </template>

                <template v-slot:opinions-header>
                    <Icon v="comment-smile"/>
                    <T>profile.opinions.header</T>
                </template>
                <template v-slot:opinions>
                    <LegendOpinionListInput v-model="defaultOpinions" readonly class="mb-0"/>
                    <LegendOpinionListInput v-model="opinions" :maxitems="5"/>
                </template>

                <template v-slot:names-header>
                    <Icon v="signature"/>
                    <T>profile.names</T>
                </template>
                <template v-slot:names>
                    <p v-if="$te('profile.namesInfo')" class="small text-muted">
                        <T>profile.namesInfo</T>
                    </p>
                    <OpinionListInput v-model="names" :customOpinions="opinions" :maxitems="128" :maxlength="config.profile.longNames ? 255 : 32"/>
                    <PropagateCheckbox field="names" :before="beforeChanges.names" :after="names" v-if="otherProfiles > 0" @change="propagateChanged"/>
                </template>

                <template v-slot:pronouns-header>
                    <Icon v="tags"/>
                    <T>profile.pronouns</T>
                </template>
                <template v-slot:pronouns>
                    <div class="alert alert-info" v-if="$t('profile.pronounsInfo')">
                        <p class="small mb-0">
                            <Icon v="info-circle"/>
                            <T>profile.pronounsInfo</T>
                        </p>
                    </div>
                    <OpinionListInput v-model="pronouns" :validation="validatePronoun" :customOpinions="opinions" :maxitems="128" :maxlength="192"/>
                </template>

                <template v-slot:description-header>
                    <Icon v="comment-edit"/>
                    <T>profile.description</T>
                </template>
                <template v-slot:description>
                    <textarea class="form-control form-control-sm" v-model="description" maxlength="1024" rows="8"/>
                </template>

                <template v-slot:flags-header>
                    <Icon v="flag"/>
                    <T>profile.flags</T>
                </template>
                <template v-slot:flags>
                    <p class="small text-muted mb-0">
                        <T>profile.flagsInfo</T>
                    </p>
                    <ButtonList v-model="flags" :options="allFlags" v-slot="s">
                        <Flag
                            :name="s.desc.split('|')[0]"
                            :alt="s.desc.split('|')[1]"
                            :img="`/flags/${s.v}.png`"
                            :asterisk="flagsAsterisk.includes(s.v)"
                        />
                    </ButtonList>
                    <PropagateCheckbox field="flags" :before="beforeChanges.flags" :after="flags" v-if="otherProfiles > 0" @change="propagateChanged"/>

                    <details class="form-group border rounded" :open="customFlags.length > 0">
                        <summary class="px-3 py-2">
                            <T>profile.flagsCustom</T>
                        </summary>
                        <div class="border-top">
                            <CustomFlagsWidget v-model="customFlags" sizes="flag" :maxitems="128"/>
                        </div>
                    </details>
                    <PropagateCheckbox field="customFlags" :before="beforeChanges.customFlags" :after="customFlags" v-if="otherProfiles > 0" @change="propagateChanged"/>
                    <Answer question="flags" small/>
                </template>

                <template v-slot:links-header>
                    <Icon v="link"/>
                    <T>profile.links</T>
                </template>
                <template v-slot:links>
                    <ListInput v-model="links" :maxitems="128">
                        <template v-slot="s">
                            <input v-model="s.val" type="url" class="form-control" @keyup="s.update(s.val)" @paste="$nextTick(() => s.update(s.val))" @change="s.update(s.val)" required/>
                        </template>
                        <template v-slot:validation="s">
                            <p v-if="s.val && !isValidLink(s.val)" class="small text-danger">
                                <Icon v="exclamation-triangle"/>
                                <span class="ml-1">{{$t('crud.validation.invalidLink')}}</span>
                            </p>
                        </template>
                    </ListInput>
                    <PropagateCheckbox field="links" :before="beforeChanges.links" :after="links" v-if="otherProfiles > 0" @change="propagateChanged"/>
                    <p class="small text-muted mb-0">
                        <Icon v="ad"/>
                        <T>profile.linksRecommended</T>
                        <a v-for="provider in recommendedLinkProviders()" :href="provider.homepage" target="_blank" rel="noopener">
                            <Icon :v="provider.icon" :set="provider.iconSet || 'l'"/>
                            {{ provider.name }}
                        </a>
                        <T>profile.linksRecommendedAfter</T>
                        😉
                    </p>
                    <p v-if="$te('profile.linksWarning')" class="small text-muted mt-2 mb-0">
                        <Icon v="exclamation-triangle"/>
                        <T>profile.linksWarning</T>
                    </p>
                </template>

                <template v-slot:birthday-header>
                    <Icon v="birthday-cake"/>
                    <T>profile.birthday</T>
                </template>
                <template v-slot:birthday>
                    <p class="small text-muted">
                        <T>profile.birthdayInfo</T>
                    </p>
                    <div class="input-group mb-3">
                        <datepicker v-model="birthday" inline :disabled-dates="disabledDates" :open-date="disabledDates.from" :initial-view="birthday !== null ? 'day' : 'year'"/>
                    </div>
                    <PropagateCheckbox field="birthday" :before="beforeChanges.birthday" :after="birthday" v-if="otherProfiles > 0" @change="propagateChanged"/>
                    <button type="button" class="btn btn-outline-danger btn-sm" v-if="birthday !== null" @click="birthday = null">
                        <Icon v="times"/>
                        <T>crud.remove</T>
                    </button>
                </template>

                <template v-slot:timezone-header>
                    <Icon v="clock"/>
                    <T>profile.timezone.header</T>
                </template>
                <template v-slot:timezone>
                    <p class="small text-muted">
                        <T>profile.timezone.info</T>
                    </p>
                    <TimezoneSelect v-model="timezone"/>
                    <PropagateCheckbox field="timezone" :before="beforeChanges.timezone" :after="timezone" v-if="otherProfiles > 0" @change="propagateChanged"/>
                </template>

                <template v-slot:words-header>
                    <Icon v="scroll-old"/>
                    <T>profile.words</T>
                </template>
                <template v-slot:words>
                    <template v-for="i in [0, 1, 2, 3]">
                        <h4 class="h5">
                            <T>profile.column</T> {{i + 1}}
                        </h4>
                        <input v-model="words[i].header" class="form-control form-control-sm mb-2" :placeholder="$t('profile.wordsColumnHeader')" maxlength="36"/>
                        <OpinionListInput v-model="words[i].values" group="words" :customOpinions="opinions" :maxitems="128"/>
                    </template>
                    <button type="button" class="btn btn-outline-warning btn-sm" @click.prevent="resetWords">
                        <T>profile.editor.defaults</T>
                    </button>
                </template>

                <template v-slot:circle-header>
                    <Icon v="heart-circle"/>
                    <T>profile.circles.header</T>
                </template>
                <template v-slot:circle>
                    <p class="small text-muted">
                        <T>profile.circles.info</T>
                    </p>

                    <CircleListInput v-model="circle" :maxitems="16"/>

                    <CircleMentions/>
                </template>

                <template v-slot:sensitive-header>
                    <Icon v="engine-warning"/>
                    <T>profile.sensitive.header</T>
                </template>
                <template v-slot:sensitive>
                    <p class="small text-muted">
                        <T>profile.sensitive.info</T>
                    </p>

                    <ListInput v-model="sensitive" maxlength="64" maxitems="16"/>
                </template>
            </TabsNav>

            <section>
                <button class="btn btn-primary w-100" type="submit">
                    <Icon v="save"/>
                    <T>profile.editor.save</T>
                </button>
            </section>

            <AdPlaceholder phkey="main-0"/>
        </form>
    </div>
    </Page>
</template>

<script>
    import {head, buildList, buildDict, isValidLink} from "../src/helpers";
    import { pronouns } from "~/src/data";
    import { buildPronoun } from "../src/buildPronoun";
    import config from '../data/config.suml';
    import link from '../plugins/link';
    import {minBirthdate, maxBirthdate, formatDate, parseDate} from '../src/birthdate';
    import opinions from '../src/opinions';
    import t from '../src/translator';

    const defaultWords = config.profile.defaultWords.map(({header, values}) => {
        return {
            header,
            values: values.map(v => {return { value: v.replace(/"/g, `'`), opinion: 'meh' }}),
        }
    })

    function coerceWords(words) {
        for (let i = 0; i < 4; i++) {
            words[i] = words[i] || {
                header: null,
                values: []
            }
        }
        return words;
    }

    function fixArrayObject(arrayObject) {
        return Array.isArray(arrayObject) ? arrayObject : Object.values(arrayObject);
    }

    const opinionsToForm = (opinions) => buildList(function*() {
        for (let [key, options] of Object.entries(opinions)) {
            yield {
                key,
                icon: options.icon,
                description: options.description || t.get(`profile.opinion.${key}`),
                colour: options.colour || '',
                style: options.style || '',
            };
        }
    })

    const buildProfile = (profiles, currentLocale) => {
        for (let locale in profiles) {
            if (!profiles.hasOwnProperty(locale)) {
                continue;
            }
            if (locale === currentLocale) {
                const profile = profiles[locale];
                return {
                    names: profile.names,
                    pronouns: profile.pronouns,
                    description: profile.description,
                    birthday: parseDate(profile.birthday),
                    timezone: profile.timezone,
                    links: profile.links,
                    flags: profile.flags,
                    customFlags: fixArrayObject(profile.customFlags),
                    words: coerceWords(profile.words),
                    teamName: profile.teamName,
                    footerName: profile.footerName,
                    footerAreas: profile.footerAreas,
                    credentials: profile.credentials,
                    credentialsLevel: profile.credentialsLevel,
                    credentialsName: profile.credentialsName,
                    opinions: opinionsToForm(profile.opinions || {}),
                    circle: profile.circle,
                    sensitive: profile.sensitive,
                };
            }
        }

        for (let locale in profiles) {
            if (!profiles.hasOwnProperty(locale)) {
                continue;
            }
            const profile = profiles[locale];
            return {
                names: profile.names,
                pronouns: [],
                description: '',
                birthday: parseDate(profile.birthday),
                timezone: profile.timezone,
                links: profile.links,
                flags: profile.flags.filter(f => !f.startsWith('-')),
                customFlags: fixArrayObject(profile.customFlags),
                words: [...defaultWords],
                teamName: profile.teamName,
                footerName: profile.footerName,
                footerAreas: [],
                credentials: [],
                credentialsLevel: null,
                credentialsName: null,
                opinions: opinionsToForm(profile.opinions || {}),
                circle: profile.circle,
                sensitive: [],
            };
        }

        return {
            names: [],
            pronouns: [],
            description: '',
            birthday: null,
            timezone: null,
            links: [],
            flags: [],
            customFlags: [],
            words: [...defaultWords],
            teamName: '',
            footerName: '',
            footerAreas: [],
            credentials: [],
            credentialsLevel: null,
            credentialsName: null,
            opinions: [],
            circle: [],
            sensitive: [],
        };
    };

    export default {
        mixins: [link],
        data() {
            return {
                saving: false,
                disabledDates: {
                    to: minBirthdate,
                    from: maxBirthdate,
                },
                propagate: [],
                flagsAsterisk: process.env.FLAGS_ASTERISK,
                defaultOpinions: opinionsToForm(opinions),
                isValidLink,
            };
        },
        async asyncData({ app, store }) {
            if (!store.state.user) {
                return {};
            }

            const profiles = (await app.$axios.$get(`/profile/get/${encodeURIComponent(store.state.user.username)}?version=2`, { headers: {
                authorization: 'Bearer ' + store.state.token,
            } })).profiles;

            const profile = buildProfile(profiles, app.context.env.LOCALE);

            return {
                ...profile,
                beforeChanges: JSON.parse(JSON.stringify(profile)),
                otherProfiles: Object.keys(profiles).filter(l => l !== app.context.env.LOCALE).length,
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
                try {
                    await this.$post(`/profile/save`, {
                        opinions: this.opinions,
                        names: this.names,
                        pronouns: this.pronouns,
                        description: this.description,
                        birthday: formatDate(this.birthday),
                        timezone: this.timezone,
                        links: [...this.links],
                        flags: [...this.flags],
                        customFlags: [...fixArrayObject(this.customFlags)],
                        words: this.words,
                        circle: this.circle,
                        sensitive: this.sensitive,

                        teamName: this.teamName,
                        footerName: this.footerName,
                        footerAreas: this.footerAreas,
                        credentials: this.credentials,
                        credentialsLevel: this.credentialsLevel,
                        credentialsName: this.credentialsName,

                        propagate: this.propagate,
                    });
                    this.$router.push(`/@${this.$user().username}`);
                } finally {
                    this.saving = false;
                }
            },
            normalisePronoun(pronoun) {
                try {
                    return decodeURIComponent(
                        pronoun
                            .toLowerCase()
                            .trim()
                            .replace(new RegExp('^' + this.$base), '')
                            .replace(new RegExp('^' + this.$base.replace(/^https?:\/\//, '')), '')
                            .replace(new RegExp('^/'), '')
                    );
                } catch {
                    return null;
                }
            },
            normaliseAndBuildPronoun(pronoun) {
                return buildPronoun(pronouns, this.normalisePronoun(pronoun));
            },
            validatePronoun(pronoun) {
                pronoun = this.normalisePronoun(pronoun);
                if (!pronoun) {
                    return 'profile.pronounsNotFound';
                }
                return pronoun === this.config.pronouns.any
                    || pronoun.startsWith(this.config.pronouns.any + ':')
                    || (this.config.pronouns.null && this.config.pronouns.null.routes && this.config.pronouns.null.routes.includes(pronoun))
                    || (this.config.pronouns.mirror && this.config.pronouns.mirror.route === pronoun)
                    || buildPronoun(pronouns, pronoun)
                        ? null
                        : 'profile.pronounsNotFound'
            },
            async resetWords() {
                await this.$confirm();

                this.words = [...defaultWords];
            },
            propagateChanged(field, checked) {
                this.propagate = this.propagate.filter(f => f !== field);
                if (checked) {
                    this.propagate.push(field);
                }
            },
        },
        computed: {
            mainPronoun() {
                let mainPronoun = buildPronoun(pronouns, this.config.profile.flags.defaultPronoun);
                let mainOpinion = -1;
                for (let {value: pronoun, opinion} of this.pronouns) {
                    const opinionValue = opinions[opinion]?.value || 0;
                    if (opinionValue > mainOpinion) {
                        const p = this.normaliseAndBuildPronoun(pronoun);
                        if (p) {
                            mainPronoun = p;
                            mainOpinion = opinionValue;
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
    section.form-group {
        margin-bottom: 5rem;
    }
</style>
