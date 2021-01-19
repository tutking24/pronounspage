<template>
    <section>
        <div class="d-none d-md-inline-flex btn-group btn-block mb-2">
            <router-link v-for="{name, icon, route} in links" :key="name"
                         :to="buildRoute(route)"
                         :class="['btn', isActiveRoute(route) ? 'btn-primary' : 'btn-outline-primary']">
                <Icon :v="icon"/>
                <T>nouns.{{name}}.header</T>
            </router-link>
        </div>
        <div class="d-block d-md-none btn-group-vertical btn-block mb-2">
            <router-link v-for="{name, icon, route} in links" :key="name"
                         :to="buildRoute(route)"
                         :class="['btn', isActiveRoute(route) ? 'btn-primary' : 'btn-outline-primary']">
                <Icon :v="icon"/>
                <T>nouns.{{name}}.header</T>
            </router-link>
        </div>
    </section>
</template>

<script>
    export default {
        data() {
            const links = [
                {name: 'neuterNouns', icon: 'deer', route: 'neutratywy'},
                {name: 'dukajNouns', icon: 'ghost', route: 'dukatywy'},
                {name: 'personNouns', icon: 'user-friends', route: 'osobatywy'},
            ];

            if (this.config.nouns.inclusive.enabled) {
                links.push({name: 'inclusive', icon: 'book-heart', route: this.config.nouns.inclusive.route});
            }

            if (this.config.nouns.terms.enabled) {
                links.push({name: 'terms', icon: 'flag', route: this.config.nouns.terms.route});
            }

            return {
                links,
            };
        },
        methods: {
            buildRoute(route) {
                return `/${this.config.nouns.route}/${route}`;
            },
            isActiveRoute(route) {
                return decodeURIComponent(this.$route.fullPath) === this.buildRoute(route);
            },
        }
    }
</script>
