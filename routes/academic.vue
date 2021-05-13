<template>
    <div>
        <LinksNav/>

        <AcademicLinks/>

        <Support/>
        <section>
            <Share :title="$t('links.headerLong')"/>
        </section>
    </div>
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
