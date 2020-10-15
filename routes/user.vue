<template>
    <div class="container">
        <h2>
            <Icon v="user"/>
            <T>user.headerLong</T>
        </h2>

        <Account v-if="$user()"/>
        <Login v-else/>
    </div>
</template>

<script>
    import { head } from "../src/helpers";

    export default {
        head() {
            return head({
                title: this.$t('user.headerLong'),
            });
        },
    }
</script>
