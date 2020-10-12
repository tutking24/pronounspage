<template>
    <div>
        <Separator icon="atom-alt"/>

        <h3 :id="$t('nouns.personNouns.id')">
            <T>nouns.personNouns.header</T>
            <small><NormativeBadge/></small>
        </h3>

        <T>nouns.personNouns.info</T>

        <h4><T>nouns.examples</T>:</h4>

        <section class="table-responsive">
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
        </section>

        <Separator icon="atom-alt"/>

        <h3 :id="$t('nouns.dukajNouns.id')">
            <T>nouns.dukajNouns.header</T>
        </h3>

        <T>nouns.dukajNouns.info</T>

        <h4><T>nouns.examples</T>:</h4>

        <section class="table-responsive">
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
                        <T>nouns.dukajNouns.label</T>
                    </th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="noun in dukajNouns" :key="noun.id">
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
                            <li v-for="w in noun.neutr">
                                <Declension :word="w" :template="dukajDeclension"/>
                            </li>
                        </ul>
                        <ul class="list-plural">
                            <li v-for="w in noun.neutrPl">
                                <Declension :word="w" plural :singularOptions="noun.neutr" :template="dukajDeclension"/>
                            </li>
                        </ul>
                    </td>
                </tr>
                </tbody>
            </table>
        </section>

        <Separator icon="atom-alt"/>

        <h3 :id="$t('nouns.neuterNouns.id')">
            <T>nouns.neuterNouns.header</T>
        </h3>

        <T>nouns.neuterNouns.info</T>
    </div>
</template>

<script>
    import {Noun, NounDeclension} from "../../../src/classes";

    export default {
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
                dukajNouns: [
                    new Noun({
                        id: 'austronauta',
                        masc: 'austronauta', fem: 'austronautka', neutr: 'austronautu',
                        mascPl: 'austronauci', femPl: 'austronautki', neutrPl: 'austronauty',
                    }),
                    new Noun({
                        id: 'przyjaciel',
                        masc: 'przyjaciel', fem: 'przyjaciółka', neutr: 'przyjaciełu',
                        mascPl: 'przyjaciele', femPl: 'przyjaciółki', neutrPl: 'przyjacieły',
                    }),
                    new Noun({
                        id: 'Europejczyk',
                        masc: 'Europejczyk', fem: 'Europejka', neutr: 'Europeju',
                        mascPl: 'Europejczycy', femPl: 'Europejki', neutrPl: 'Europejy',
                    }),
                ],
                dukajDeclension: new NounDeclension({
                    M: 'u', D: 'u', C: 'u', B: 'u', N: 'um', Msc: 'um', W: 'u',
                    M_pl: 'y', D_pl: 'ych', C_pl: 'ym', B_pl: 'y', N_pl: 'ami', Msc_pl: 'ach', W_pl: 'y',
                }),
            }
        },
    }
</script>
