<template>
    <div>
        <h2>
            <Icon v="collective-logo.svg"/>
            <T>contact.team.name</T>
        </h2>

        <figure class="float-end border rounded">
            <img src="/img/collective-logo.svg" alt="" class="revesible"/>
            <figcaption>
                <p><T>contact.team.logo</T></p>
                <p class="text-center bigger mb-0">
                    <Icon v="transgender-alt"/>
                    +
                    <Icon v="comment"/>
                    =
                    <Icon v="collective-logo.svg"/>
                </p>
            </figcaption>
        </figure>

        <section>
            <T>contact.team.description</T>
        </section>

        <router-link :to="'/' + config.links.blogRoute" v-if="config.links.blog"
                     class="btn btn-outline-primary btn-lg">
            <Icon v="pen-nib"/>
            <T>links.blog</T>
        </router-link>

        <section>
            <h3>
                <Icon v="user-friends"/>
                <T>contact.team.members</T>
            </h3>

            <template v-for="(members, locale) in membersByLocale" v-if="members.length">
                <h4 class="mt-4">
                    <template v-if="locale === ''">
                        <T>contact.team.upcoming</T>
                    </template>
                    <template v-else-if="locale === config.locale">
                        {{locales[locale].name}}
                    </template>
                    <a v-else :href="locales[locale].url">
                        {{locales[locale].name}}
                    </a>
                </h4>
                <ul class="list-unstyled member-list">
                    <li v-for="member in members" class="mb-3 d-flex">
                        <a :href="`https://pronouns.page/@${member.username}`">
                            <Avatar :user="member" dsize="4rem"/>
                        </a>
                        <span class="ms-2">
                            {{ member.teamName }}
                            <br/>
                            <a :href="`https://pronouns.page/@${member.username}`" class="badge bg-light text-dark border">
                                @{{member.username}}
                            </a>
                        </span>
                    </li>
                </ul>
            </template>
        </section>
    </div>
</template>

<script>
    import { head } from "../src/helpers";

    export default {
        head() {
            return head({
                title: this.$t('contact.team.name'),
            });
        },
        async asyncData({app}) {
            return {
                membersByLocale: await app.$axios.$get(`/admin/list`),
            }
        },
    }
</script>

<style lang="scss" scoped>
    @import "assets/variables";

    img {
        max-width: 100%;
    }

    figure {
        width: 100%;
        max-width: 18rem;
        padding: $spacer;
        > img {
            width: 100%;
        }
        figcaption {
            font-size: $small-font-size;
        }
    }
    @include media-breakpoint-down('md', $grid-breakpoints) {
        figure {
            float: none !important;
            margin: 0 auto;
        }
    }

    .bigger {
        font-size: 2rem;
    }

    @include media-breakpoint-up('md', $grid-breakpoints) {
        .member-list {
            column-count: 3;
            column-width: 16rem;
        }
    }
</style>
