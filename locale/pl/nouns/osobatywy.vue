<template>
    <div>
        <NounsNav/>

        <h2>
            <Icon v="user-friends"/>
            <T>nouns.personNouns.header</T>
            <small><NormativeBadge/></small>
        </h2>

        <section>
            <T>nouns.personNouns.info</T>
            <p><Share :title="$t('nouns.personNouns.header')"/></p>
        </section>

        <details open class="border mb-3">
            <summary class="bg-light p-3">
                <h4 class="h5 d-inline"><T>nouns.examples</T></h4>
            </summary>
            <div class="border-top table-responsive">
                <table class="table table-striped table-hover table-fixed-3">
                    <thead>
                    <tr>
                        <th class="text-nowrap">
                            <Icon v="mars"/>
                            <T>nouns.masculine</T>
                        </th>
                        <th class="text-nowrap">
                            <Icon v="venus"/>
                            <T>nouns.feminine</T>
                        </th>
                        <th class="text-nowrap">
                            <Icon v="neuter"/>
                            <T>nouns.personNouns.label</T>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="noun in personNouns" :key="noun.id">
                        <td>
                            <ul class="list-singular">
                                <li v-for="w in noun.masc">{{ w }}</li>
                            </ul>
                            <ul class="list-plural">
                                <li v-for="w in noun.mascPl">{{ w }}</li>
                            </ul>
                        </td>
                        <td>
                            <ul class="list-singular">
                                <li v-for="w in noun.fem">{{ w }}</li>
                            </ul>
                            <ul class="list-plural">
                                <li v-for="w in noun.femPl">{{ w }}</li>
                            </ul>
                        </td>
                        <td>
                            <ul class="list-singular">
                                <li v-for="w in noun.neutr">{{ w }}</li>
                            </ul>
                            <ul class="list-plural">
                                <li v-for="w in noun.neutrPl">{{ w }}</li>
                            </ul>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </details>

        <section v-if="sources && Object.keys(sources).length">
            <Literature :sources="sources"/>
        </section>
    </div>
</template>

<script>
    import {Noun, SourceLibrary} from "../../../src/classes";
    import {head} from "../../../src/helpers";
    import NounsNav from "./NounsNav";

    export default {
        components: { NounsNav },
        data() {
            return {
                personNouns: [
                    new Noun({
                        id: 'kandydat',
                        masc: 'kandydat', fem: 'kandydatka', neutr: 'osoba kandydująca',
                        mascPl: 'kandydaci', femPl: 'kandydatki', neutrPl: 'osoby kandydujące',
                    }),
                    new Noun({
                        id: 'kucharz',
                        masc: 'kucharz', fem: 'kucharka', neutr: 'osoba gotująca|osoba kucharska',
                        mascPl: 'kucharze', femPl: 'kucharki', neutrPl: 'osoby gotujące|osoby kucharskie',
                    }),
                    new Noun({
                        id: 'mężczyzna',
                        masc: 'mężczyzna', fem: 'kobieta', neutr: 'osoba|osoba niebinarna',
                        mascPl: 'mężczyźni', femPl: 'kobiety', neutrPl: 'osoby|osoby niebinarne',
                    }),
                    new Noun({
                        id: 'partner',
                        masc: 'partner', fem: 'partnerka', neutr: 'osoba partnerska',
                        mascPl: 'partnerzy', femPl: 'partnerki', neutrPl: 'osoby partnerskie',
                    }),
                    new Noun({
                        id: 'prezes',
                        masc: 'prezes', fem: 'prezeska', neutr: 'osoba prezesujące',
                        mascPl: 'prezesi', femPl: 'prezeski', neutrPl: 'osoby prezesujące',
                    }),
                ],
                sources: undefined,
            }
        },
        async mounted() {
            this.sources = {
                '': new SourceLibrary(await this.$axios.$get(`/sources?pronoun=osobatywy`)).getForPronoun('osobatywy'),
            };
        },
        head() {
            return head({
                title: this.$t('nouns.personNouns.header'),
                description: this.$t('nouns.personNouns.info')[0],
            });
        },
    }
</script>
