<template>
    <div class="main">
        <section v-if="config.links.split">
            <div class="d-none d-md-inline-flex btn-group btn-block mb-2 w-100">
                <a :href="`#${route}`" v-for="{name, icon, route} in links" :key="name"
                            :class="['btn', tab === route ? 'btn-primary' : 'btn-outline-primary']"
                            @click.prevent="tab = route">
                    <Icon :v="icon"/>
                    <T>links.{{name}}</T>
                </a>
            </div>
            <!--
            <div class="d-block d-md-none btn-group-vertical btn-block mb-2 w-100">
                <router-link v-for="{name, icon, route} in links" :key="name"
                             :to="buildRoute(route)"
                             :class="['btn', isActiveRoute(route) ? 'btn-primary' : 'btn-outline-primary']">
                    <Icon :v="icon"/>
                    <T>nouns.{{name}}.header</T>
                </router-link>
            </div>
            -->
        </section>

        <Blog v-if="tab === '' || tab === config.links.blogRoute"/>
        <Links v-if="tab === '' || tab === config.links.linksRoute"/>
        <Media v-if="tab === '' || tab === config.links.mediaRoute"/>
        <Recommended v-if="tab === '' || tab === config.links.linksRoute"/>
        <Socials v-if="tab === '' || tab === config.links.linksRoute"/>
        <LanguageVersions v-if="tab === '' || tab === config.links.linksRoute"/>
        <Support/>
        <section>
            <Share :title="$t('links.headerLong')"/>
        </section>
    </div>
</template>

<script>
    import { head } from "../src/helpers";

    var audio;

    export default {
        data() {
            const links = [];

            if (Object.keys(this.config.links.blog).length) {
                links.push({name: 'blog', route: this.config.links.blogRoute, icon: 'pen-nib'});
            }
            if (this.config.links.academic.length) {
                links.push({name: 'academic', route: this.config.links.academicRoute, icon: 'vial'});
            }
            if (this.config.links.links.length) {
                links.push({name: 'links', route: this.config.links.linksRoute, icon: 'link'});
            }
            if (this.config.links.mediaGuests.length || this.config.links.mediaMentions.length) {
                links.push({name: 'media', route: this.config.links.mediaRoute, icon: 'tv'});
            }

            return {
                tab: '',
                links,
            };
        },
        mounted() {
            if (!process.client) {
                return;
            }


        },
        methods: {
            isActiveRoute(route) {
                return false;
                //return decodeURIComponent(this.$route.fullPath).replace(/\/$/, '') === this.buildRoute(route).replace(/\/$/, '');
            },

            play() {
                //audio.play();
            },
        },
        head() {
            return head({
                title: this.$t('links.headerLong'),
            });
        },
    };
</script>
