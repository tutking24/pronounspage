<template>
    <section v-if="Object.keys(socials).length">
        <h2 class="mb-3">
            <Icon v="hashtag"/>
            <T>links.social</T>
        </h2>
        <ul class="list-unstyled">
            <template v-for="(groupLinks, group) in socials">
                <li v-if="$t(`contact.groups.${group}`)"><p class="h5"><T>contact.groups.{{group}}</T><T>quotation.colon</T></p></li>
                <Link v-for="link in groupLinks" :link="link" :key="link.url"/>
            </template>
        </ul>
    </section>
</template>

<script>
import {getSocialLinks} from '../src/contact';
import {groupBy} from '../src/helpers';

export default {
    data() {
        return {
            socials: groupBy([...getSocialLinks(this.config)], l => l.group),
        };
    },
}
</script>
