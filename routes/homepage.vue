<template>
    <div>
        <template v-if="$te('home.welcome')">
            <section>
                <h2>
                    <T>home.welcome</T>
                </h2>

                <p>
                    <T>home.intro</T>
                </p>

                <div class="row">
                    <div v-for="{icon, header, route} in mainLinks" class="col-12 col-lg my-4 text-center">
                        <nuxt-link :to="`/${route}`">
                            <p>
                                <Icon :v="icon" size="3"/>
                            </p>
                            <p class="h4">
                                <Spelling :text="$t(header)"/>
                            </p>
                        </nuxt-link>
                    </div>
                </div>

                <CalendarBanner link/>
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

            <CalendarBanner v-if="!$te('home.welcome')" link/>
        </section>

        <Separator icon="fist-raised"/>

        <Mission/>

        <Separator icon="bookmark"/>

        <section>
            <div class="row">
                <div class="col-12 col-md-6">
                    <LanguageVersions/>
                </div>
                <div class="col-12 col-md-6">
                    <Socials/>
                </div>
            </div>
        </section>

        <Separator icon="people-carry"/>
        <section>
            <Support/>
        </section>
    </div>
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

            return { mainLinks };
        }
    }
</script>
