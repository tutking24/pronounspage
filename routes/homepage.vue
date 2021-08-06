<template>
    <div>
        <h2>
            <Icon v="tags"/>
            <T>home.why</T>
        </h2>

        <section>
            <T>home.about</T>

            <ModeSwitch class="mt-3"/>

            <div v-if="!user && $t('profile.banner', {}, false)" class="alert alert-info">
                <nuxt-link :to="'/' + config.user.route" class="float-end btn btn-primary m-2 me-0">
                    <Icon v="id-card"/>
                    <Spelling :text="$t('profile.bannerButton')"/>
                </nuxt-link>
                <LinkedText :text="$t('profile.banner')"/>
            </div>
        </section>

        <section>
            <Share/>
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
            <Support/>
        </section>
    </div>
</template>

<script>
    import {mapState} from "vuex";

    export default {
        computed: {
            ...mapState([
                'user',
            ]),
        },
    }
</script>
