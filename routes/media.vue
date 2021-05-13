<template>
    <div>
        <LinksNav/>

        <Media/>

        <Socials/>
        <Support/>
        <section>
            <Share :title="$t('links.social')"/>
        </section>
    </div>
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
