<template>
    <div class="container">
        <h2>
            <Icon v="atom-alt"/>
            Słownik neutratywów
        </h2>

        <section>
            <p>
                Feminatywy feminatywami, ale prawdziwe wyzwanie to tworzenie neutratywów!
            </p>
            <p>
                Poniżej przedstawiamy tworzony przez społeczność słownik rzeczowników
                z wyszczególnieniem ich formy męskiej, żeńskiej i neutralnej.
            </p>
            <p>
                <strong>Czym są neutratywy?</strong>
                Są to słowa ukute na nijakie wersje słów nacechowanych płciowo, analogicznie do feminatywów, czyli wersji żeńskich.
            </p>
            <p>
                <strong>Dlaczego warto tworzyć neutratywy?</strong>
                Z tych samych powodów co feminatywy!
                O ile łatwiej byłoby, gdyby nazwy zawodów zatraciły swoje często męskie nacechowanie.
                Niestety tak się nie dzieje, przez co domyślnie możemy określać płeć osoby wykonującej ten zawód jako męską.
            </p>
            <p>
                Jednak nie każda osoba chce używać zaimków i form męskich czy żeńskich,
                choćby dlatego, że płeć człowieka wymyka się tym dwóm kategoriom.
                Coraz więcej osób używa w odniesieniu do siebie
                <nuxt-link to="/ono">rodzaju nijakiego</nuxt-link> i <nuxt-link to="/">innych form</nuxt-link>.
                Formy te zaczynają być także potrzebne w tłumaczeniach z języków,
                gdzie używane są formy niebinarne takie jak choćby angielskie zaimki they/them.
                Z tego powodu proponujemy rozbudowę niebinarnej polszczyzny poprzez wspólne tworzenie form nijakich.
            </p>

            <Share title="Słownik neutratywów"/>
        </section>

        <Separator icon="book-open"/>

        <section v-if="secret">
            <div class="alert alert-info">
                <strong>{{ nounsCountApproved() }}</strong> wpisów zatwierdzonych,
                <strong>{{ nounsCountPending() }}</strong> oczekuje na moderację.
            </div>
        </section>

        <section class="sticky-top">
            <div class="input-group mb-3 bg-white">
                <div class="input-group-prepend">
                    <span class="input-group-text">
                        <Icon v="filter"/>
                    </span>
                </div>
                <input class="form-control border-primary" v-model="filter" placeholder="Filtruj listę…" ref="filter"/>
                <div class="input-group-append" v-if="filter">
                    <button class="btn btn-outline-danger" @click="filter = ''; $refs.filter.focus()">
                        <Icon v="times"/>
                    </button>
                </div>
                <div class="input-group-append">
                    <button class="btn btn-outline-success" @click="$refs.form.$el.scrollIntoView()">
                        <Icon v="plus-circle"/>
                        Zgłoś
                    </button>
                </div>
            </div>
        </section>

        <section class="table-responsive">
            <table :class="'table table-striped table-hover table-fixed-' + (secret ? 4 : 3)">
                <thead>
                <tr>
                    <th class="text-nowrap">
                        <Icon v="mars"/>
                        maskulatyw
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
                <template v-if="visibleNouns().length">
                <tr v-for="noun in visibleNouns()" :class="{'mark-left': !noun.approved}">
                    <td>
                        <ul class="list-singular">
                            <li v-for="w in noun.masc">{{ w }}</li>
                        </ul>
                        <ul class="list-plural">
                            <li v-for="w in noun.mascPl">{{ w }}</li>
                        </ul>

                        <small v-if="noun.base && nouns[noun.base]">
                            <p><strong>Propozycja zmiany z:</strong></p>
                            <ul class="list-singular">
                                <li v-for="w in nouns[noun.base].masc">{{ w }}</li>
                            </ul>
                            <ul class="list-plural">
                                <li v-for="w in nouns[noun.base].mascPl">{{ w }}</li>
                            </ul>
                        </small>

                        <button v-if="!secret" class="btn btn-outline-primary btn-sm m-1 hover-show" @click="edit(noun)">
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

                        <small v-if="noun.base && nouns[noun.base]">
                            <p><strong>Propozycja zmiany z:</strong></p>
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

                        <small v-if="noun.base && nouns[noun.base]">
                            <p><strong>Propozycja zmiany z:</strong></p>
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
                                <button class="btn btn-outline-primary btn-sm m-1" @click="edit(noun)">
                                    <Icon v="pen"/>
                                    Edytuj
                                </button>
                            </li>
                        </ul>
                    </td>
                </tr>
                </template>
                <template v-else>
                    <tr>
                        <td :colspan="secret ? 4 : 3" class="text-center">
                            <Icon v="search"/>
                            Nie znaleziono słów spełniających podane kryterium.
                        </td>
                    </tr>
                </template>
                </tbody>
            </table>
        </section>

        <Separator icon="plus"/>

        <NounSubmitForm ref="form" :secret="secret"/>
    </div>
</template>

<script>
    import { Noun } from "~/src/classes";
    import { buildDict } from "../src/helpers";
    import { head } from "../src/helpers";

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
        mounted() {
            if (process.client && window.location.hash) {
                this.filter = decodeURIComponent(window.location.hash.substr(1));
                this.$refs.filter.focus();
                this.$refs.filter.scrollIntoView();
                setTimeout(_ => {
                    this.$refs.filter.scrollIntoView();
                }, 1000);
            }
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
            visibleNouns() {
                return Object.values(this.nouns).filter(n => n.matches(this.filter));
            },
            nounsCountApproved() {
                return Object.values(this.nouns).filter(n => n.approved).length;
            },
            nounsCountPending() {
                return Object.values(this.nouns).filter(n => !n.approved).length;
            },
        },
        computed: {
            nouns() {
                return buildDict(function* (that) {
                    const sorted = that.nounsRaw.sort((a, b) => {
                        if (a.approved && !b.approved) {
                            return 1;
                        }
                        if (!a.approved && b.approved) {
                            return -1;
                        }
                        return a.masc.toLowerCase().localeCompare(b.masc.toLowerCase());
                    });
                    for (let w of sorted) {
                        yield [w.id, new Noun(w)];
                    }
                }, this);
            },
        },
        watch: {
            filter() {
                if (process.client) {
                    if (this.filter) {
                        window.location.hash = this.filter;
                    } else {
                        history.pushState('', document.title, window.location.pathname + window.location.search);
                    }
                }
            }
        },
        head() {
            return head({
                title: 'Słownik neutratywów',
                description: 'Feminatywy feminatywami, ale prawdziwe wyzwanie to tworzenie neutratywów! Przedstawiamy tworzony przez społeczność słownik rzeczowników z wyszczególnieniem ich formy męskiej, żeńskiej i neutralnej.',
                banner: 'bannerNouns.png',
            });
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
        border-left: 3px solid $primary;
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
