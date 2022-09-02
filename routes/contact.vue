<template>
    <Page>
        <h2>
            <Icon v="comment-alt-smile"/>
            <T>contact.header</T>
        </h2>

        <section>
            <nuxt-link v-if="config.faq.enabled" :to="`/${config.faq.route}`"
                class="btn btn-outline-primary border m-1"
            >
                <Icon v="map-marker-question"/>
                <T>faq.header</T>
            </nuxt-link>
            <a v-for="link in links" :key="link.url"
                :href="link.url" target="_blank" rel="noopener"
                class="btn btn-outline-primary border m-1">
                    <Icon :v="link.icon" :set="link.iconSet || 'l'"/>
                    {{link.headline}}
            </a>
        </section>

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
    import { head } from "../src/helpers";
    import {getContactLinks, getSocialLinks} from '../src/contact';

    export default {
        data() {
            return {
                links: [...getContactLinks(this.config), ...getSocialLinks(this.config)],
            };
        },
        head() {
            return head({
                title: this.$t('contact.header'),
            });
        },
    }
</script>
