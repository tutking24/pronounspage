<template>
    <div>
        <LinksNav/>
        <Blog/>
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
