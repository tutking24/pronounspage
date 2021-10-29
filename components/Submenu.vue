<template>
    <section class="mt-4 mt-lg-0">
        <div class="d-none d-md-inline-flex btn-group btn-block mb-2 w-100">
            <router-link v-for="{name, icon, iconInverse, route, condition} in links" :key="name"
                         v-if="condition === undefined || condition === true"
                         :to="buildRoute(route)"
                         :class="['btn', isActiveRoute(route) ? 'btn-primary' : 'btn-outline-primary']">
                <Icon :v="icon" :inverse="iconInverse === undefined ? false : (iconInverse || isActiveRoute(route))"/>
                <T>{{name}}</T>
            </router-link>
        </div>
        <div class="d-block d-md-none btn-group-vertical btn-block mb-2 w-100">
            <router-link v-for="{name, icon, iconInverse, route, condition} in links" :key="name"
                         v-if="condition === undefined || condition === true"
                         :to="buildRoute(route)"
                         :class="['btn', isActiveRoute(route) ? 'btn-primary' : 'btn-outline-primary']">
                <Icon :v="icon" :inverse="iconInverse === undefined ? false : (iconInverse || isActiveRoute(route))"/>
                <T>{{name}}</T>
            </router-link>
        </div>
    </section>
</template>

<script>
    export default {
        props: {
            prefix: {'default': ''},
            links: {required: true},
        },
        methods: {
            buildRoute(route) {
                return `${this.prefix}/${route}`;
            },
            isActiveRoute(route) {
                let current = decodeURIComponent(this.$route.fullPath).replace(/\/$/, '');
                if (current.includes('#')) {
                    current = current.substring(0, current.indexOf('#'));
                }
                const expected = this.buildRoute(route).replace(/\/$/, '');
                return current === expected || current.startsWith(expected + '/');
            },
        },
    }
</script>
