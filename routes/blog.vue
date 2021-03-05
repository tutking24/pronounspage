<template>
    <div class="main">
        <Blog/>
    </div>
</template>

<script>
    import { head } from "../src/helpers";

    export default {
        head() {
            return head({
                title: this.$t('contact.team.blog'),
            });
        },
    };
</script>
