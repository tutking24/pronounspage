<template>
    <Page>
        <LinksNav/>

        <AcademicLinks/>

        <Separator icon="heart"/>
        <Support/>
        <section>
            <Share :title="$t('links.headerLong')"/>
        </section>
    </Page>
</template>

<script>
    import { head } from "../src/helpers";

    export default {
        head() {
            return head({
                title: this.$t('links.academic'),
            });
        },
    };
</script>
