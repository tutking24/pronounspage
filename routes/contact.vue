<template>
    <Page>
        <h2>
            <Icon v="comment-alt-smile"/>
            <T>contact.header</T>
        </h2>

        <section class="small">
            <p v-if="$te('contact.faq')">
                <Icon v="map-marker-question"/>
                <T>contact.faq</T>
            </p>

            <p v-if="$te('contact.technical')">
                <Icon v="cogs"/>
                <T>contact.technical</T>
            </p>

            <p>
                <Icon v="language"/>
                <T>contact.language</T>
            </p>

            <p>
                <Icon v="language"/>
                <T>localise.long</T>
                <LocaleLink locale="en" link="/new-version">
                    <T>localise.longLink</T>
                </LocaleLink>
            </p>

            <p v-if="$te('contact.quote')">
                <Icon v="quote-right"/>
                <T>contact.quote</T>
            </p>

            <p v-if="$te('contact.hate')">
                <Icon v="hand-middle-finger"/>
                <T>contact.hate</T>
            </p>
        </section>

        <section v-for="(groupLinks, group) in links">
            <h3 v-if="$t(`contact.groups.${group}`)"><T>contact.groups.{{group}}</T><T>quotation.colon</T></h3>
            <div class="row">
                <div v-for="link in groupLinks" :key="link.url"
                     class="col-12 col-md-6 col-xl-4">
                    <a
                        :href="link.url" target="_blank" rel="noopener"
                        class="card mb-3 text-decoration-none hover-shadow">
                        <div class="card-body p-0 d-flex d-flex" style="height: 3rem"
                             :style="`background-color: ${link.colour}; border: 2px solid ${link.colour}`"
                        >
                            <div class="text-white flex-grow-1 d-flex justify-content-center align-items-center">
                                <Icon :v="link.icon" :set="link.iconSet || 'l'" size="2"/>
                            </div>
                            <img v-if="link.avatar" :src="`/img/social/${link.avatar}`" alt="" class="rounded" style="width: 3rem;"/>
                        </div>
                        <div class="card-body text-center h6 mb-0">
                            {{link.headline}}
                        </div>
                    </a>
                </div>
            </div>
        </section>

        <section>
            <h3 class="mb-3">
                <Icon v="users"/>
                <T>contact.authors</T>
            </h3>
            <Authors bigteam/>
        </section>

        <Support id="support"/>

        <Contribute id="contribute"/>

        <Mission/>
    </Page>
</template>

<script>
import {head, groupBy} from "../src/helpers";
import {getContactLinks, getSocialLinks} from '../src/contact';

export default {
    data() {
        return {
            links: groupBy([...getContactLinks(this.config), ...getSocialLinks(this.config)], l => l.group),
        };
    },
    head() {
        return head({
            title: this.$t('contact.header'),
        });
    },
}
</script>
