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
                    <template v-for="(groupLinks, group) in links">
                        <li v-if="$t(`contact.groups.${group}`)"><strong><T>contact.groups.{{group}}</T><T>quotation.colon</T></strong></li>
                        <li v-for="link in groupLinks" :key="link.url" class="mb-2">
                            <a :href="link.url" target="_blank" rel="me">
                                <Icon :v="link.icon" :set="link.iconSet || 'l'"/>
                                <span v-for="lang in link.lang || []" class="badge bg-light text-dark border">{{lang}}</span>
                                {{link.headline}}
                            </a>
                        </li>
                    </template>
                </ul>

                <p class="h6 mb-2">
                    <T>contact.contribute.header</T><T>quotation.colon</T>
                </p>
                <ul class="list-unstyled mb-4">
                    <li class="mb-2" v-if="!config.disableTranslationProposals">
                        <a href="#" @click.prevent="translationMode">
                            <Icon v="language"/>
                            <T>translationMode.action</T>
                        </a>
                    </li>
                    <li class="mb-2">
                        <a href="https://en.pronouns.page/new-version">
                            <Icon v="globe-africa"/>
                            <T>localise.short</T>
                        </a>
                    </li>
                    <li class="mb-2">
                        <a href="https://gitlab.com/PronounsPage/PronounsPage/-/boards">
                            <Icon v="code-merge"/>
                            <T>contact.contribute.technical.footer</T>
                        </a>
                    </li>
                    <li v-if="config.ads && config.ads.enabled && $isGranted()" class="mb-2">
                        <a href="#" @click.prevent="toggleAds">
                            <Icon v="ad"/>
                            [admins]
                            <span v-if="adsVisible">Disable ads</span>
                            <span v-else>Enable ads</span>
                        </a>
                    </li>
                    <li v-if="config.ads && config.ads.enabled && $isGranted('*')" class="mb-2">
                        <a href="#" @click.prevent="$store.commit('toggleAdPlaceholdersVisible')">
                            <Icon v="ad"/>
                            [admins]
                            Toggle ad placeholder visibility
                        </a>
                    </li>
                </ul>

                <!--
                <p class="h6 mb-2">
                    <T>support.header</T><T>quotation.colon</T>
                </p>
                <ul class="list-unstyled mb-4">
                    <li v-for="link in supportLinks" :key="link.url" class="mb-2">
                        <a :href="link.url" target="_blank" rel="me">
                            <Icon :v="link.icon" :set="link.iconSet || 'l'"/>
                            <span v-for="lang in link.lang || []" class="badge bg-light text-dark border">{{lang}}</span>
                            {{link.headline}}
                        </a>
                    </li>
                </ul>
                -->

                <div class="mt-2 mb-4 text-center">
                    <ModeSwitch/>
                </div>

                <p class="small text-muted text-center">
                    Version:
                    {{ versionFrontend ? versionFrontend.substring(0, 8) : '–' }}
                    /
                    <Spinner v-if="versionBackend === undefined"/><span v-else>{{ versionBackend ? versionBackend.substring(0, 8) : '–' }}</span>
                </p>

                <!--
                <p class="h6 mb-2">
                    <T>share</T><T>quotation.colon</T>
                </p>
                <div class="my-2">
                    <Share nolabel/>
                </div>
                -->
            </div>

            <div class="col-12 col-md-6 col-lg-4 small">
                <p class="h6 mb-2">
                    <T>footer.legal</T><T>quotation.colon</T>
                </p>
                <p v-if="$te('footer.ageLimit')">
                    <Icon v="exclamation-triangle"/>
                    <T>footer.ageLimit</T>
                </p>
                <ul class="list-unstyled mb-4">
                    <li class="mb-2">
                        <nuxt-link :to="`/${config.user.termsRoute}`">
                            <Icon v="gavel"/>
                            <T>terms.header</T>
                        </nuxt-link>
                    </li>
                    <li class="mb-2">
                        <nuxt-link :to="`/${config.user.privacyRoute}`">
                            <Icon v="user-secret"/>
                            <T>privacy.header</T>
                        </nuxt-link>
                    </li>
                    <li class="mb-2">
                        <Icon v="gavel"/>
                        <T>footer.license</T>
                    </li>
                    <li class="mb-2">
                        <Icon v="tools"/>
                        Using <a href="https://www.gradientmagic.com/" target="_blank" rel="noopener">gradientmagic.com</a>
                        and <a href="https://fonts.google.com/noto/specimen/Noto+Color+Emoji" target="_blank" rel="noopener">Noto Color Emoji</a>
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
                        <a href="https://gitlab.com/PronounsPage/PronounsPage" target="_blank" rel="noopener">
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
                    <T>footer.sibling</T><T>quotation.colon</T>
                </p>
                <Siblings/>

                <Stats/>
            </div>
        </div>
        <AdPlaceholder phkey="footer"/>
        <EasterEgg/>
        <UkraineBanner class="my-3"/>
        </div>
    </footer>
    <div v-else>
        <a v-for="link in links" :key="link.url" :href="link.url" target="_blank" rel="me">&nbsp;</a>
        <!--<a v-for="link in supportLinks" :key="link.url"  :href="link.url" target="_blank" rel="me">&nbsp;</a>-->
    </div>
</template>

<script>
import {getContactLinks, getSocialLinks, getSupportLinks} from '../src/contact';
import {groupBy} from "../src/helpers";

export default {
    data() {
        return {
            links: groupBy([...getContactLinks(this.config), ...getSocialLinks(this.config)], l => l.group),
            supportLinks: [...getSupportLinks(this.config)],
            versionFrontend: process.env.VERSION,
            versionBackend: undefined,
            adsVisible: false,
        };
    },
    async mounted() {
        if (!process.client) { return; }

        this.versionBackend = await this.$axios.$get('/version');
        this.adsVisible = parseInt(localStorage.getItem('adsVisible') || '0') === 1
    },
    methods: {
        async translationMode() {
            if (!this.$user()) {
                await this.$alert(this.$t('translationMode.logIn'));
                return;
            }
            await this.$alert(this.$t('translationMode.welcome'));
            this.$store.commit('showTranslationMode');
            this.$cookies.set('translationModeVisible', true);
        },
        async toggleAds() {
            if (!this.$isGranted()) { return; }
            localStorage.setItem('adsVisible', this.adsVisible ? '0' : '1');
            window.location.reload();
        },
    },
}
</script>
