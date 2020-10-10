<template>
    <div class="container">
        <Links top/>
        <Media/>
        <Socials/>
    </div>
</template>

<script>
    import { head } from "../src/helpers";

    export default {
        head() {
            return head({
                title: this.$t('links.headerLong'),
            });
        },
    };
</script>
