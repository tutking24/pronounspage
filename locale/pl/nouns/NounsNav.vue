<template>
    <section class="mt-4 mt-lg-0">
        <div class="d-none d-md-inline-flex btn-group btn-block mb-2 w-100">
            <router-link v-for="{name, icon, route} in links" :key="name"
                         :to="buildRoute(route)"
                         :class="['btn', isActiveRoute(route) ? 'btn-primary' : 'btn-outline-primary']">
                <Icon :v="icon"/>
                <T>{{name}}</T>
            </router-link>
        </div>
        <div class="d-block d-md-none btn-group-vertical btn-block mb-2 w-100">
            <router-link v-for="{name, icon, route} in links" :key="name"
                         :to="buildRoute(route)"
                         :class="['btn', isActiveRoute(route) ? 'btn-primary' : 'btn-outline-primary']">
                <Icon :v="icon"/>
                <T>{{name}}</T>
            </router-link>
        </div>
    </section>
</template>

<script>
    export default {
        data() {
            const links = [
                {name: 'nouns.neuterNouns.header', icon: 'deer', route: 'neutratywy'},
                {name: 'nouns.dukajNouns.header', icon: 'ghost', route: 'dukatywy'},
                {name: 'nouns.personNouns.header', icon: 'user-friends', route: 'osobatywy'},
                {name: 'nouns.xNouns.header', icon: 'comment-times', route: 'iksatywy'},
            ];

            if (this.config.inclusive.enabled) {
                links.push({name: 'inclusive.header', icon: 'book-heart', route: this.config.inclusive.route});
            }

            if (this.config.terminology.enabled) {
                links.push({name: 'terminology.header', icon: 'flag', route: this.config.terminology.route});
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
                let current = decodeURIComponent(this.$route.fullPath).replace(/\/$/, '');
                if (current.includes('#')) {
                    current = current.substring(0, current.indexOf('#'));
                }
                return current === this.buildRoute(route).replace(/\/$/, '');
            },
        },
    }
</script>
