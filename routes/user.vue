<template>
    <div class="container">
        <h2>
            <Icon v="user"/>
            <T>user.header</T>
        </h2>

        <div v-if="token">
            <pre><code>{{JSON.stringify(token)}}</code></pre>
            <pre>{{JSON.stringify(payload, null, 4)}}</pre>
        </div>
        <button v-else class="btn btn-primary" @click="login">Zaloguj</button>
    </div>
</template>

<script>
    import { head } from "../src/helpers";
    import jwt from 'jsonwebtoken';

    export default {
        data() {
            return {
                token: null,
            }
        },
        computed: {
            payload() {
                if (!this.token) {
                    return null;
                }

                return jwt.verify(this.token, process.env.PUBLIC_KEY, {
                    algorithm: 'RS256',
                    audience: process.env.BASE_URL,
                    issuer: process.env.BASE_URL,
                });
            }
        },
        methods: {
            async login() {
                this.token = await this.$axios.$post(`/user`);
            },
        },
        head() {
            return head({
                title: this.$t('user.headerLong'),
            });
        },
    }
</script>
