<template>
    <footer v-if="config.header" class="bg-light border-top shadow mt-5">
        <div class="container-wide py-5">
        <div class="row">
            <div class="col-12 col-md-6 col-lg-4 small">
                <p class="h6 mb-2">
                    <T>contact.authors</T><T>quotation.colon</T>
                </p>
                <Authors/>
            </div>

            <div class="col-12 col-md-6 col-lg-4 small">
                <p class="h6 mb-2">
                    <T>footer.links</T><T>quotation.colon</T>
                </p>
                <ul class="list-unstyled mb-4">
                    <li v-if="config.faq.enabled" class="mb-2">
                        <nuxt-link :to="`/${config.faq.route}`">
                            <Icon v="map-marker-question"/>
                            <T>faq.headerLong</T>
                        </nuxt-link>
                    </li>
                    <li v-for="link in links" :key="link.url" class="mb-2">
                        <a :href="link.url">
                            <Icon :v="link.icon" :set="link.iconSet || 'l'"/>
                            {{link.headline}}
                        </a>
                    </li>
                </ul>

                <p class="h6 mb-2">
                    <T>support.header</T><T>quotation.colon</T>
                </p>
                <ul class="list-unstyled mb-4">
                    <li v-for="link in supportLinks" :key="link.url" class="mb-2">
                        <a :href="link.url">
                            <Icon :v="link.icon" :set="link.iconSet || 'l'"/>
                            {{link.headline}}
                        </a>
                    </li>
                </ul>
            </div>

            <div class="col-12 col-md-6 col-lg-4 small">
                <p class="h6 mb-2">
                    <T>footer.legal</T><T>quotation.colon</T>
                </p>
                <ul class="list-unstyled mb-4">
                    <li class="mb-2">
                        <nuxt-link :to="`/${config.user.termsRoute}`">
                            <Icon v="gavel"/>
                            <T>terms.header</T>
                        </nuxt-link>
                    </li>
                    <li class="mb-2">
                        <Icon v="gavel"/>
                        <T>footer.license</T>
                    </li>
                    <li class="mb-2">
                        <Icon v="tools"/>
                        Using <a href="https://www.gradientmagic.com/" target="_blank" rel="noopener">gradientmagic.com</a>
                        and <a href="https://twemoji.twitter.com/" target="_blank" rel="noopener">Twemoji</a>
                    </li>
                </ul>

                <p class="h6 mb-2">
                    <T>footer.technical</T><T>quotation.colon</T>
                </p>
                <ul class="list-unstyled mb-4">
                    <li class="mb-2">
                        <nuxt-link v-if="config.api !== null" to="/api">
                            <Icon v="laptop-code"/>
                            <T>api.header</T>
                        </nuxt-link>
                        <LocaleLink v-else locale="en" link="/api">
                            <Icon v="laptop-code"/>
                            <T>api.header</T>
                        </LocaleLink>
                    </li>
                    <li class="mb-2">
                        <a href="https://gitlab.com/Avris/Zaimki" target="_blank" rel="noopener">
                            <Icon v="gitlab" set="b"/>
                            Source code
                        </a>
                    </li>
                    <li class="mb-2">
                        <a href="https://avris.it" target="_blank" rel="noopener">
                            <Icon v="avris.svg"/>
                            avris.it
                        </a>
                    </li>
                </ul>
                <p class="h6 mb-2">
                    <T>share</T><T>quotation.colon</T>
                </p>
                <div class="my-2">
                    <Share nolabel shareApiSeparate/>
                </div>
                <div class="my-2">
                    <ModeSwitch/>
                </div>
            </div>
        </div>
            <EasterEgg/>
        </div>
    </footer>
</template>

<script>
import {getContactLinks, getSocialLinks, getSupportLinks} from '../src/contact';

export default {
    data() {
        return {
            links: [...getContactLinks(this.config), ...getSocialLinks(this.config)],
            supportLinks: [...getSupportLinks(this.config)],
        };
    },
}
</script>
