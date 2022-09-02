<template>
    <Page>
        <h2>
            <Icon v="user"/>
            <T>user.headerLong</T>
        </h2>

        <Account v-if="$user()"/>
        <MfaValidation v-else-if="preToken"/>
        <Login v-else/>
    </Page>
</template>

<script>
    import { head } from "../src/helpers";
    import {mapState} from "vuex";

    export default {
        computed: {
            ...mapState([
                'preToken',
            ]),
        },
        head() {
            return head({
                title: this.$t('user.headerLong'),
            });
        },
    }
</script>
