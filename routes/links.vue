<template>
    <Page>
        <LinksNav/>

        <section v-if="config.links.blog && !config.links.split">
            <h2 class="mb-3">
                <Icon v="pen-nib"/>
                <T>links.blog</T>
            </h2>
            <BlogEntriesList :posts="posts" details/>
        </section>
        <Endorsements/>
        <AdPlaceholder phkey="main-0"/>
        <Links/>
        <AdPlaceholder phkey="main-1"/>
        <AcademicLinks v-if="!config.links.split && config.links.academic.length > 0"/>
        <AdPlaceholder phkey="main-2"/>
        <Media v-if="(config.links.mediaGuests.length + config.links.mediaMentions.length > 0) && (!config.links.split || (config.links.mediaGuests.length + config.links.mediaMentions.length <= 2))"/>
        <AdPlaceholder phkey="main-3"/>
        <Recommended/>
        <AdPlaceholder phkey="main-4"/>
        <Socials/>
        <AdPlaceholder phkey="main-5"/>
        <LanguageVersions/>
        <section>
            <h2 class="mb-3">
                <Icon v="home-heart"/>
                <T>footer.sibling</T>
            </h2>
            <Siblings/>
        </section>
        <Support/>
        <section>
            <Share :title="$t('links.headerLong')"/>
        </section>
    </Page>
</template>

<script>
    import { head } from "../src/helpers";

    export default {
        async asyncData({app}) {
            return {
                posts: await app.$axios.$get(`/blog`),
            }
        },
        head() {
            return head({
                title: this.$t('links.headerLong'),
            });
        },
    };
</script>
