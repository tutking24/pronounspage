<template>
    <div class="container">
        <h1>
            <Icon v="atom-alt"/>
            Słownik neutratywów
        </h1>

        <section>
            <p>
                Feminatywy feminatywami, ale prawdziwe wyzwanie to tworzenie neutratywów!
            </p>
            <p>
                Poniżej przedstawiamy tworzony przez społeczność słownik rzeczowników
                z wyszczególnieniem ich formy męskiej, żeńskiej i neutralnej.
            </p>
            <p>
                Aby dodać swoją propozycję:
                <button class="btn btn-outline-success btn-sm" @click="$refs.form.$el.scrollIntoView()">
                    <Icon v="plus-circle"/>
                    Formularz zgłoszeniowy
                </button>
            </p>
            <p>
                Dla form neutralnych innych niż rzeczowniki zapraszamy na
                <nuxt-link to="/" class="btn btn-outline-primary btn-sm">
                    <Icon v="tags"/>
                    Zaimki.pl
                </nuxt-link>
            </p>

            <Share title="Słownik neutratywów"/>
        </section>

        <Separator icon="book-open" colour="nouns"/>

        <section>
            <input class="form-control border-nouns" v-model="filter" autofocus placeholder="Filtruj listę…"/>
        </section>

        <section class="table-responsive">
            <table :class="'table table-striped table-hover table-fixed-' + (secret ? 4 : 3)">
                <thead>
                <tr>
                    <th class="text-nowrap">
                        <Icon v="mars"/>
                        maskulinatyw
                    </th>
                    <th class="text-nowrap">
                        <Icon v="venus"/>
                        feminatyw
                    </th>
                    <th class="text-nowrap">
                        <Icon v="neuter"/>
                        neutratyw
                    </th>
                    <th v-if="secret"></th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="noun in nouns" v-if="noun.matches(filter)" :class="{'mark-left': !noun.approved}">
                    <td>
                        <ul class="list-singular">
                            <li v-for="w in noun.masc">{{ w }}</li>
                        </ul>
                        <ul class="list-plural">
                            <li v-for="w in noun.mascPl">{{ w }}</li>
                        </ul>

                        <small v-if="noun.base">
                            <p><strong>Propozycja zmiany do:</strong></p>
                            <ul class="list-singular">
                                <li v-for="w in nouns[noun.base].masc">{{ w }}</li>
                            </ul>
                            <ul class="list-plural">
                                <li v-for="w in nouns[noun.base].mascPl">{{ w }}</li>
                            </ul>
                        </small>

                        <button v-if="!secret" class="btn btn-outline-nouns btn-sm m-1 hover-show" @click="edit(noun)">
                            <Icon v="pen"/>
                            Zaproponuj zmianę
                        </button>
                    </td>
                    <td>
                        <ul class="list-singular">
                            <li v-for="w in noun.fem">{{ w }}</li>
                        </ul>
                        <ul class="list-plural">
                            <li v-for="w in noun.femPl">{{ w }}</li>
                        </ul>

                        <small v-if="noun.base">
                            <p><strong>Propozycja zmiany do:</strong></p>
                            <ul class="list-singular">
                                <li v-for="w in nouns[noun.base].fem">{{ w }}</li>
                            </ul>
                            <ul class="list-plural">
                                <li v-for="w in nouns[noun.base].femPl">{{ w }}</li>
                            </ul>
                        </small>
                    </td>
                    <td>
                        <ul class="list-singular">
                            <li v-for="w in noun.neutr">{{ w }}</li>
                        </ul>
                        <ul class="list-plural">
                            <li v-for="w in noun.neutrPl">{{ w }}</li>
                        </ul>

                        <small v-if="noun.base">
                            <p><strong>Propozycja zmiany do:</strong></p>
                            <ul class="list-singular">
                                <li v-for="w in nouns[noun.base].neutr">{{ w }}</li>
                            </ul>
                            <ul class="list-plural">
                                <li v-for="w in nouns[noun.base].neutrPl">{{ w }}</li>
                            </ul>
                        </small>
                    </td>
                    <td v-if="secret">
                        <ul class="list-unstyled">
                            <li v-if="!noun.approved">
                                <button class="btn btn-success btn-sm m-1" @click="approve(noun)">
                                    <Icon v="check"/>
                                    Zatwierdź
                                </button>
                            </li>
                            <li v-else @click="hide(noun)">
                                <button class="btn btn-outline-secondary btn-sm m-1">
                                    <Icon v="times"/>
                                    Schowaj
                                </button>
                            </li>
                            <li>
                                <button class="btn btn-outline-danger btn-sm m-1" @click="remove(noun)">
                                    <Icon v="trash"/>
                                    Usuń
                                </button>
                            </li>
                            <li>
                                <button class="btn btn-outline-nouns btn-sm m-1" @click="edit(noun)">
                                    <Icon v="pen"/>
                                    Edytuj
                                </button>
                            </li>
                        </ul>
                    </td>
                </tr>
                </tbody>
            </table>
        </section>

        <Separator icon="plus" colour="nouns"/>

        <NounSubmitForm ref="form" :secret="secret"/>
    </div>
</template>

<script>
    import { Noun } from "~/src/classes";
    import { buildDict } from "../src/helpers";

    export default {
        data() {
            return {
                filter: '',
                nounsRaw: [],
                secret: this.$route.query.secret,
            }
        },
        async asyncData({app, route}) {
            return {
                nounsRaw: await app.$axios.$get(`/nouns/all?secret=${route.query.secret || ''}`),
            };
        },
        methods: {
            edit(noun) {
                this.$refs.form.edit(noun);
            },
            async approve(noun) {
                await this.$axios.$post(`/nouns/approve/${noun.id}?secret=${this.secret || ''}`);
                if (noun.base) {
                    delete this.nouns[noun.base];
                }
                noun.approved = true;
                noun.base = null;
                this.$forceUpdate();
            },
            async hide(noun) {
                await this.$axios.$post(`/nouns/hide/${noun.id}?secret=${this.secret || ''}`);
                noun.approved = false;
                this.$forceUpdate();
            },
            async remove(noun) {
                if (!confirm('Czy na pewno usunąć ten wpis?')) {
                    return false;
                }
                await this.$axios.$post(`/nouns/remove/${noun.id}?secret=${this.secret || ''}`);
                delete this.nouns[noun.id];
                this.$forceUpdate();
            },
        },
        computed: {
            nouns() {
                return buildDict(function* (that) {
                    for (let w of that.nounsRaw) {
                        yield [w.id, new Noun(w)];
                    }
                }, this);
            },
        },
        head() {
            const title = 'Słownik neutratywów';
            const banner = `${process.env.baseUrl}/bannerNouns.png`;

            return {
                title: title,
                meta: [
                    { hid: 'og:title', property: 'og:title', content: title },
                    { hid: 'twitter:title', property: 'twitter:title', content: title },

                    { hid: 'og:logo', property: 'og:logo', content: banner },
                    { hid: 'twitter:image', property: 'twitter:image', content: banner },
                ],
            }
        },
    }
</script>

<style lang="scss">
    @import "assets/style";

    .list-singular {
        padding-left: 0;
        list-style: none;
        li {
            white-space: nowrap;
        }
        li:before {
            content: "⋅";
            display: inline-block;
            width: $fa-fw-width;
            text-align: center;
        }
    }
    .list-plural {
        padding-left: 0;
        list-style: none;
        li {
            white-space: nowrap;
        }
        li:before {
            content: "⁖";
            display: inline-block;
            width: $fa-fw-width;
            text-align: center;
        }
    }

    .mark-left {
        border-left: 3px solid $nouns;
    }

    tr {
        .hover-show {
            opacity: 0;
        }
        &:hover .hover-show {
            opacity: 1;
        }
    }
</style>
