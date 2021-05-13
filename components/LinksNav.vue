<template>
    <section v-if="config.links.split" class="mt-4 mt-lg-0">
        <div class="d-none d-md-inline-flex btn-group btn-block mb-2 w-100">
            <router-link v-for="{name, icon, route} in links" :to="`/${route}`" :key="name"
                         :class="['btn', isActiveRoute(route) ? 'btn-primary' : 'btn-outline-primary']">
                <Icon :v="icon"/>
                <T>{{name}}</T>
            </router-link>
        </div>
        <div class="d-block d-md-none btn-group-vertical btn-block mb-2 w-100">
            <router-link v-for="{name, icon, route} in links" :key="name"
                         :to="`/${route}`"
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
            const links = [];

            if (this.config.links.links.length) {
                links.push({name: 'links.links', route: this.config.links.route, icon: 'bookmark'});
            }
            if (this.config.links.academic.length) {
                links.push({name: 'links.academic', route: this.config.links.academicRoute, icon: 'vial'});
            }
            if (Object.keys(this.config.links.blog).length) {
                links.push({name: 'links.blog', route: this.config.links.blogRoute, icon: 'pen-nib'});
            }
            if (this.config.links.mediaGuests.length || this.config.links.mediaMentions.length) {
                links.push({name: 'links.media', route: this.config.links.mediaRoute, icon: 'tv'});
            }
            if (this.config.faq.enabled) {
                links.push({name: 'faq.header', route: this.config.faq.route, icon: 'map-marker-question'});
            }
            if (this.config.people.enabled) {
                links.push({name: 'people.header', route: this.config.people.route, icon: 'user-friends'});
            }

            return {
                links,
            };
        },
        methods: {
            isActiveRoute(route) {
                return decodeURIComponent(this.$route.fullPath).replace(/\/$/, '') === '/' + route.replace(/\/$/, '');
            },
        },
    };
</script>
