<template>
    <section>
        <div class="d-none d-md-inline-flex btn-group btn-block mb-2 w-100">
            <router-link v-for="{name, icon, route} in links" :key="name"
                         :to="buildRoute(route)"
                         :class="['btn', isActiveRoute(route) ? 'btn-primary' : 'btn-outline-primary']">
                <Icon :v="icon"/>
                <T>nouns.{{name}}.header</T>
            </router-link>
        </div>
        <div class="d-block-force d-md-none btn-group-vertical btn-block mb-2 w-100">
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
                {name: 'nouns', icon: 'book', route: ''},
            ];

            if (this.config.inclusive.enabled) {
                links.push({name: 'inclusive', icon: 'book-heart', route: this.config.inclusive.route});
            }

            if (this.config.terminology.enabled) {
                links.push({name: 'terms', icon: 'flag', route: this.config.terminology.route});
            }

            return {
                links,
            };
        },
        methods: {
            buildRoute(route) {
                return `/${route}`;
            },
            isActiveRoute(route) {
                return decodeURIComponent(this.$route.fullPath).replace(/\/$/, '') === this.buildRoute(route).replace(/\/$/, '');
            },
        }
    }
</script>
