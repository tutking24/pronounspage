<template>
    <Submenu v-if="config.links.split" :links="[
        {name: 'links.links', route: config.links.route, icon: 'bookmark', condition: config.links.links.length > 0},
        {name: 'links.academic', route: config.links.academicRoute, icon: 'vial', condition: config.links.academic.length > 0},
        {name: 'links.blog', route: config.links.blogRoute, routesExtra: ['blogEntry', 'blogEntryShortcut'], icon: 'pen-nib', condition: config.links.blog},
        {name: 'links.zine.header', route: config.links.zine.route, icon: 'zine.svg', iconInverse: darkMode, condition: config.links.zine && config.links.zine.enabled},
        {name: 'links.mediaShort', route: config.links.mediaRoute, icon: 'tv', condition: config.links.mediaGuests.length > 1 || config.links.mediaMentions.length > 1},
        {name: 'faq.header', route: config.faq.route, icon: 'map-marker-question', condition: config.faq.enabled},
        {name: 'english.header', route: config.english.route, icon: 'globe-americas', condition: config.english.enabled},
    ]"/>
</template>

<script>
    import {mapState} from "vuex";

    export default {
        computed: {
            ...mapState([
                'darkMode',
            ]),
        },
    };
</script>
