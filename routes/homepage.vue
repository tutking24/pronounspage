<template>
    <Page>
        <UkraineBanner class="mb-4"/>
        <template v-if="$te('home.welcome')">
            <section>
                <h2>
                    <T>home.welcome</T>
                </h2>

                <p>
                    <T>home.intro</T>
                </p>

                <div class="row">
                    <div v-for="{icon, header, route, link} in mainLinks" :class="[mainLinks.length > 3 ? 'col-6 col-lg-3' : 'col', 'my-4', 'text-center']">
                        <LocaleLink :link="link || route" :locale="link ? 'external' : config.locale">
                            <p>
                                <Icon :v="icon" size="2" class="d-inline-block d-lg-none"/>
                                <Icon :v="icon" size="3" class="d-none d-lg-inline-block"/>
                            </p>
                            <p class="h5">
                                <Spelling :text="$t(header)"/>
                            </p>
                        </LocaleLink>
                    </div>
                </div>

                <AdPlaceholder phkey="main-0"/>

                <CalendarBanner link/>

                <AdPlaceholder phkey="main-1"/>
            </section>

            <section>
                <Share/>
            </section>

            <Separator icon="info-circle"/>
        </template>

        <section>
            <h2>
                <T>home.why</T>
            </h2>

            <T>home.about</T>

            <AdPlaceholder phkey="main-2"/>

            <CalendarBanner v-if="!$te('home.welcome')" link/>
        </section>

        <Separator icon="fist-raised"/>

        <Mission/>

        <Separator icon="bookmark"/>

        <section>
            <AdPlaceholder phkey="main-3"/>
            <div class="row">
                <div class="col-12 col-md-6">
                    <LanguageVersions/>
                </div>
                <div class="col-12 col-md-6">
                    <Socials/>
                </div>
            </div>
        </section>

        <template v-if="posts.length">
            <Separator icon="pen-nib" class="mb-5"/>
            <section>
                <BlogEntriesList :posts="posts"/>
            </section>
        </template>

        <Separator icon="heart"/>
        <section>
            <Support/>
            <Contribute/>
        </section>
    </Page>
</template>

<script>
    import { mapState } from "vuex";

    export default {
        computed: {
            ...mapState([
                'user',
            ]),
        },
        data() {
            const mainLinks = [];
            if (this.config.pronouns.enabled) {
                mainLinks.push({
                    icon: 'tags',
                    header: 'pronouns.headerLong',
                    route: this.config.pronouns.route,
                })
            }
            if (this.config.nouns.enabled) {
                mainLinks.push({
                    icon: 'book',
                    header: 'nouns.headerLong',
                    route: this.config.nouns.route,
                })
            }
            if (this.config.user.enabled) {
                mainLinks.push({
                    icon: 'id-card',
                    header: 'profile.bannerButton',
                    route: this.config.user.route,
                })
            }
            // if (this.config.locale === 'pl') {
            //     mainLinks.push({
            //         icon: 'isjp.svg',
            //         header: 'isjp.homepage',
            //         link: 'https://isjp.pl',
            //     })
            // }

            return {
                mainLinks,
                posts: [],
            };
        },
        async mounted() {
            if (this.config.blog && this.config.blog.shortcuts) {
                this.posts = await this.$axios.$get(`/blog?shortcuts`);
            }
        },
    }
</script>
