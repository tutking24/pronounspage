<template>
    <ul :class="{'list-unstyled': !expanded}">
        <li v-for="author in authors">
            {{ author.name }}
            (<nuxt-link :to="author.pronounsLink">{{ author.pronouns }}</nuxt-link>,
            <a v-if="author.website" :href="author.website" target="_blank" rel="noopener"><Icon v="globe"/></a>
            <a v-if="author.twitter" :href="'https://twitter.com/' + author.twitter" target="_blank" rel="noopener"><Icon v="twitter" set="b"/></a>
            <a v-if="author.mail" :href="'mailto:' + author.mail" target="_blank" rel="noopener"><Icon v="envelope"/></a>)
            –
            <template v-for="(link, area, index) in author.areas">
                <Spaceless>
                    <nuxt-link v-if="link && link.indexOf('/') === 0" :to="link">{{ area }}</nuxt-link>
                    <a v-else-if="link" :href="link" target="_blank" rel="noopener">{{ area }}</a>
                    <span v-else>{{ area }}</span>
                    <span v-if="index < Object.keys(author.areas).length - 1">, </span>
                </Spaceless>
            </template>
        </li>
    </ul>
</template>

<script>
    export default {
        props: {
            expanded: { type: Boolean }
        },
        data() {
            return {
                authors: [
                    {
                        name: 'Andrea',
                        pronouns: 'onu',
                        pronounsLink: '/onu',
                        website: 'https://avris.it',
                        twitter: 'AvrisIT',
                        mail: 'andrea@avris.it',
                        areas: {
                            kod: 'https://gitlab.com/Avris/Zaimki',
                            język: null,
                        },
                    },
                    {
                        name: 'Paweł Dembowski',
                        pronouns: 'on',
                        pronounsLink: '/on',
                        twitter: 'VaultAusir',
                        mail: 'pawel.dembowski@gmail.com',
                        areas: {
                            język: null,
                            literatura: '/literatura',
                        },
                    },
                    {
                        name: 'Zuzanna Sybilla Grzybowska',
                        pronouns: 'ona/ono',
                        pronounsLink: '/ona&ono/jej',
                        twitter: 'mykofanes',
                        mail: 'zuzannagrzybowska@protonmail.com',
                        areas: {
                            neutratywy: '/neutratywy',
                        },
                    },
                ],
            };
        },
    }
</script>
