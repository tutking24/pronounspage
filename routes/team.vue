<template>
    <Page>
        <CommunityNav/>

        <h2>
            <Icon v="collective-logo.svg" class="invertible"/>
            <T>contact.team.name</T>
        </h2>

        <figure class="float-end border rounded m-3">
            <img src="/img-local/logo/logo-full-path.svg" alt="" class="invertible"/>
            <hr/>
            <figcaption>
                <p><T>contact.team.logo</T></p>
                <p class="text-center bigger mb-0">
                    <Icon v="transgender-alt"/>
                    +
                    <Icon v="comment"/>
                    =
                    <Icon v="collective-logo.svg" class="invertible"/>
                </p>
                <div class="btn-group w-100 mt-3">
                    <a href="/img-local/logo/logo-full.png" class="btn btn-outline-primary btn-sm" download>
                        <Icon v="cloud-download"/>
                        PNG
                    </a>
                    <a href="/img-local/logo/logo-full-path.svg" class="btn btn-outline-primary btn-sm" download>
                        <Icon v="cloud-download"/>
                        SVG
                    </a>
                </div>
            </figcaption>
        </figure>

        <section>
            <p><T>contact.team.description</T></p>
            <ul v-if="$te('contact.team.extra')">
                <li v-for="item in $t('contact.team.extra')">
                    <LinkedText :text="item"/>
                </li>
            </ul>
        </section>

        <Mission/>

        <section v-if="$te('contact.team.credentials')">
            <h3>
                <Icon v="graduation-cap"/>
                <T>contact.team.credentials.header</T>
            </h3>

            <T>contact.team.credentials.description</T>

            <ul>
                <li v-for="credential in credentials">
                    <Spelling :text="convertName(credential.credentialsName || credential.teamName)"/>
                    <a :href="`https://pronouns.page/@${credential.username}`" class="badge bg-light text-dark border">
                        @{{credential.username}}
                    </a>
                    <ul>
                        <li v-for="item in credential.credentials">
                            <ProfileLink v-if="item.startsWith('https://') || item.startsWith('http://')" :link="item"/>
                            <LinkedText v-else :text="item"/>
                        </li>
                    </ul>
                </li>
            </ul>
        </section>

        <section>
            <Contribute id="contribute"/>
        </section>

        <section v-if="false && $te('contact.team.join')">
            <h3>
                <Icon v="user-plus"/>
                <T>contact.team.join.header</T>
            </h3>
            <p><T>contact.team.join.encouragement</T></p>
            <p><T>contact.team.join.areasIntro</T></p>
            <ul>
                <li v-for="item in $t('contact.team.join.areas')"><Spelling :text="item"/></li>
            </ul>
            <p><T>contact.team.join.allies</T></p>
            <div v-if="$te('contact.team.join.warning')" class="alert alert-warning">
                <p class="mb-0">
                    <Icon v="exclamation-triangle"/>
                    <T>contact.team.join.warning</T>
                </p>
            </div>
            <p><T>contact.team.join.how</T></p>
            <ul>
                <li v-for="item in $t('contact.team.join.application')"><Spelling :text="item"/></li>
            </ul>
        </section>

        <AdPlaceholder phkey="main-0"/>

        <section>
            <h3>
                <Icon v="user-friends"/>
                <T>contact.team.members</T>
            </h3>

            <template v-for="(members, locale) in membersByLocale" v-if="members.length">
                <h4 class="mt-4">
                    <template v-if="locale === ''">
                        <T>contact.team.upcoming</T>
                    </template>
                    <template v-else-if="locale === config.locale">
                        {{locales[locale].name}}
                    </template>
                    <a v-else :href="locales[locale].url">
                        {{locales[locale].name}}
                    </a>
                </h4>
                <ul class="list-unstyled member-list">
                    <li v-for="member in members" class="mb-3 d-flex">
                        <a :href="`https://pronouns.page/@${member.username}`">
                            <Avatar :user="member" dsize="4rem"/>
                        </a>
                        <span class="ms-2">
                            <Spelling :text="convertName(member.teamName)"/>
                            <br/>
                            <a :href="`https://pronouns.page/@${member.username}`" class="badge bg-light text-dark border">
                                @{{member.username}}
                            </a>
                        </span>
                    </li>
                </ul>
            </template>
        </section>

        <AdPlaceholder phkey="main-1"/>
    </Page>
</template>

<script>
    import { head } from "../src/helpers";
    import spelling from "../plugins/spelling";

    export default {
        mixins: [ spelling ],
        head() {
            return head({
                title: this.$t('contact.team.name'),
                description: this.$t('contact.team.description'),
            });
        },
        async asyncData({app}) {
            return {
                membersByLocale: await app.$axios.$get(`/admin/list`),
            }
        },
        computed: {
            credentials() {
                const r = [];
                for (let locale in this.membersByLocale) {
                    if (!this.membersByLocale.hasOwnProperty(locale)) { continue; }
                    for (let member of this.membersByLocale[locale]) {
                        if (member.locale === this.config.locale && member.credentials !== null) {
                            r.push(member);
                        }
                    }
                }

                return r.sort((a, b) => {
                    if (a.credentialsLevel > b.credentialsLevel) { return -1; }
                    if (a.credentialsLevel < b.credentialsLevel) { return 1; }

                    return Math.random() > 0.5 ? 1 : -1;
                });
            },
        },
    }
</script>

<style lang="scss" scoped>
    @import "assets/variables";

    img {
        max-width: 100%;
    }

    figure {
        width: 100%;
        max-width: 18rem;
        padding: $spacer;
        > img {
            width: 100%;
        }
        figcaption {
            font-size: $small-font-size;
        }
    }
    @include media-breakpoint-down('md', $grid-breakpoints) {
        figure {
            float: none !important;
            margin: 0 auto;
        }
    }

    .bigger {
        font-size: 2rem;
    }

    @include media-breakpoint-up('md', $grid-breakpoints) {
        .member-list {
            column-count: 3;
            column-width: 16rem;
        }
    }
</style>
