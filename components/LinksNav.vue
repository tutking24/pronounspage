<template>
    <Submenu v-if="config.links.split" :links="[
        {name: 'links.links', route: config.links.route, icon: 'bookmark', condition: config.links.links.length > 0},
        {name: 'links.academic', route: config.links.academicRoute, icon: 'vial', condition: config.links.academic.length > 0},
        {name: 'links.blog', route: config.links.blogRoute, icon: 'pen-nib', condition: config.links.blog},
        {name: 'links.media', route: config.links.mediaRoute, icon: 'tv', condition: config.links.mediaGuests.length > 0 || config.links.mediaMentions.length > 0},
        {name: 'faq.header', route: config.faq.route, icon: 'map-marker-question', condition: config.faq.enabled},
        {name: 'english.header', route: config.english.route, icon: 'globe-americas', condition: config.english.enabled},
    ]"/>
</template>
