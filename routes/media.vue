<template>
    <Page>
        <LinksNav/>

        <Media/>

        <Socials/>
        <Separator icon="heart"/>
        <Support/>
        <section>
            <Share :title="$t('links.social')"/>
        </section>
    </Page>
</template>

<script>
    import { head } from "../src/helpers";

    export default {
        head() {
            return head({
                title: this.$t('links.media'),
            });
        },
    };
</script>
