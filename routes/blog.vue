<template>
    <div>
        <LinksNav/>
        <Blog/>
        <Support/>
        <section>
            <Share :title="$t('links.blog')"/>
        </section>
    </div>
</template>

<script>
    import { head } from "../src/helpers";

    export default {
        head() {
            return head({
                title: this.$t('links.blog'),
            });
        },
    };
</script>
