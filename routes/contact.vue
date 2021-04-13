<template>
    <div>
        <h2>
            <Icon v="comment-alt-smile"/>
            <T>contact.header</T>
        </h2>

        <section>
            <a v-for="link in [...config.contact.contacts, ...config.links.socials]" :key="link.url"
               :href="link.url" target="_blank" rel="noopener"
               class="btn btn-outline-primary border m-1">
                <Icon :v="link.icon" :set="link.iconSet || 'l'"/>
                {{link.headline}}
            </a>
        </section>

        <section class="small">
            <p>
                <Icon v="language"/>
                <T>localise.long</T>
                <LocaleLink locale="en" link="/blog/creating-new-language-version">
                    <T>localise.longLink</T>
                </LocaleLink>
            </p>

            <p v-if="$t('contact.quote', {}, false)">
                <Icon v="quote-right"/>
                <T>contact.quote</T>
            </p>

            <p v-if="$t('contact.hate', {}, false)">
                <Icon v="hand-middle-finger"/>
                <T>contact.hate</T>
            </p>
        </section>

        <section>
            <h3 class="mb-3">
                <Icon v="users"/>
                <T>contact.authors</T>
            </h3>
            <Authors/>
        </section>

        <Support/>
    </div>
</template>

<script>
    import { head } from "../src/helpers";

    export default {
        head() {
            return head({
                title: this.$t('contact.header'),
            });
        },
    }
</script>
