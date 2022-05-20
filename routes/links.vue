<template>
    <div>
        <LinksNav/>

        <section v-if="config.links.blog && !config.links.split">
            <h2 class="mb-3">
                <Icon v="pen-nib"/>
                <T>links.blog</T>
            </h2>
            <BlogEntriesList :posts="posts" details/>
        </section>

        <h2 class="mb-3">
            <Icon v="badge-check"/>
            Mecenaty i współpraca
        </h2>
        <div class="row">
            <div class="col-12 col-lg-6 row" v-for="(book, key) in config.links.mecenat" :key="key">
                <div class="col-6">
                    <img :src="`/img-local/mecenat/${key}.png`" class="mw-100 shadow"/>
                </div>
                <div class="col-6 mb-3">
                    <h3 class="h4">
                        {{book.title}}
                    </h3>
                    <p class="mb-1" v-if="book.author">
                        {{book.author}}
                    </p>
                    <p class="small" v-if="book.publisher">
                        ({{book.publisher}})
                    </p>
                    <p class="small">
                        {{book.description}}
                    </p>
                </div>
            </div>
        </div>

        <Links/>
        <AcademicLinks v-if="!config.links.split && config.links.academic.length > 0"/>
        <Media v-if="!config.links.split && (config.links.mediaGuests.length > 0 || config.links.mediaMentions.length > 0)"/>
        <Recommended/>
        <Socials/>
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
    </div>
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
