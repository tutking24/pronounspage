<template>
    <div>
        <div class="btn-group btn-block">
            <a :href="'#' + $t('nouns.personNouns.id')" class="btn btn-outline-primary">
                <Icon v="atom-alt"/>
                <T>nouns.personNouns.header</T>
            </a>
            <a :href="'#' + $t('nouns.dukajNouns.id')" class="btn btn-outline-primary">
                <Icon v="atom-alt"/>
                <T>nouns.dukajNouns.header</T>
            </a>
            <a :href="'#' + $t('nouns.neuterNouns.id')" class="btn btn-outline-primary">
                <Icon v="atom-alt"/>
                <T>nouns.neuterNouns.header</T>
            </a>
        </div>

        <Separator icon="atom-alt"/>

        <h3 :id="$t('nouns.personNouns.id')">
            <T>nouns.personNouns.header</T>
            <small><NormativeBadge/></small>
        </h3>

        <T>nouns.personNouns.info</T>

        <details class="border mb-3">
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

        <Separator icon="atom-alt"/>

        <h3 :id="$t('nouns.dukajNouns.id')">
            <T>nouns.dukajNouns.header</T>
        </h3>

        <T>nouns.dukajNouns.info</T>

        <details class="border mb-3">
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
                                <li><Icon v="question-square"/></li>
                                <!--
                                <li v-for="w in noun.neutrPl">
                                    <Declension :word="w" plural :singularOptions="noun.neutr" :template="dukajDeclension"/>
                                </li>
                                -->
                            </ul>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </details>

        <Separator icon="atom-alt"/>

        <h3 :id="$t('nouns.neuterNouns.id')">
            <T>nouns.neuterNouns.header</T>
        </h3>

        <T>nouns.neuterNouns.info</T>

        <details class="border mb-3">
            <summary class="bg-light p-3">
                <h4 class="h5 d-inline"><T>nouns.neuterNouns.alt.header</T></h4>
            </summary>
            <div class="border-top">
                <div class="p-4 pb-0">
                    <T>nouns.neuterNouns.alt.info</T>
                </div>
                <div class="table-responsive">
                    <table class="table table-striped table-hover table-fixed-3">
                        <thead>
                        <tr>
                            <th v-for="templates in neuterAltDeclensionTemplates" class="text-nowrap">
                                <ul class="list-inline mb-0">
                                    <li v-for="template in templates" class="list-inline-item">
                                        <nuxt-link :to="'/' + template">
                                            {{ template }}
                                        </nuxt-link>
                                    </li>
                                </ul>
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(declensions, word) in neuterAltDeclension" :key="word">
                            <td v-for="declension in declensions">
                                <Declension :word="word" :template="declension" open condense/>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </details>
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
                        id: 'Europejczyk',
                        masc: 'Europejczyk', fem: 'Europejka', neutr: 'Europeju',
                        mascPl: 'Europejczycy', femPl: 'Europejki', neutrPl: 'Europejy',
                    }),
                    new Noun({
                        id: 'przyjaciel',
                        masc: 'przyjaciel', fem: 'przyjaciółka', neutr: 'przyjaciełu',
                        mascPl: 'przyjaciele', femPl: 'przyjaciółki', neutrPl: 'przyjacieły',
                    }),
                    new Noun({
                        id: 'twórca',
                        masc: 'twórca', fem: 'twórczyni', neutr: 'twórcu',
                        mascPl: 'twórcy', femPl: 'twórczynie', neutrPl: 'twórcy',
                    }),
                ],
                dukajDeclension: new NounDeclension({
                    M: 'u', D: 'u', C: 'u', B: 'u', N: 'um', Msc: 'um', W: 'u',
                    M_pl: 'y', D_pl: 'ych', C_pl: 'ym', B_pl: 'y', N_pl: 'ami', Msc_pl: 'ach', W_pl: 'y',
                }),
                neuterAltDeclensionTemplates: [
                    ['ono/jego'], // , 'vono/vego', 'ono/jejgo'],
                    ['ono/jej'],
                    ['ono/jeno'],
                    ['ono/jenu'],
                ],
                neuterAltDeclension: {
                    księgowe: [
                        new NounDeclension({
                            M: 'owe', D: 'owego', C: 'owemu', B: 'owe', N: 'owem/owym', Msc: 'owem/owym', W: 'owe',
                        }),
                        new NounDeclension({
                            M: 'owe', D: 'owej', C: 'owej', B: 'owe', N: 'ową', Msc: 'owej', W: 'owe',
                        }),
                        new NounDeclension({
                            M: 'owe', D: 'oweno', C: 'owenu', B: 'owe/oweno', N: 'owem', Msc: 'owem', W: 'owe',
                        }),
                        new NounDeclension({
                            M: 'owe', D: 'owu', C: 'owenu', B: 'owe', N: 'owum', Msc: 'owum', W: 'owe',
                        }),
                    ],
                    pracownicze: [
                        new NounDeclension({
                            M: 'cze', D: 'cza', C: 'czu', B: 'cze', N: 'czem', Msc: 'czu', W: 'cze',
                        }),
                        new NounDeclension({
                            M: 'cze', D: 'czej', C: 'czej', B: 'cze', N: 'czą', Msc: 'czej', W: 'cze',
                        }),
                        new NounDeclension({
                            M: 'cze', D: 'cza', C: 'czu', B: 'cze', N: 'czem', Msc: 'czu', W: 'cze',
                        }),
                        new NounDeclension({
                            M: 'cze', D: 'ku', C: 'ku', B: 'cze', N: 'kum', Msc: 'kum', W: 'cze',
                        }),
                    ],
                    kochanie: [
                        new NounDeclension({
                            M: 'nie', D: 'nia', C: 'niu', B: 'nie', N: 'niem', Msc: 'niu', W: 'nie',
                        }),
                        new NounDeclension({
                            M: 'nie', D: 'niej', C: 'niej', B: 'nie', N: 'nią', Msc: 'niej', W: 'nie',
                        }),
                        new NounDeclension({
                            M: 'nie', D: 'nia', C: 'niu', B: 'nie', N: 'niem', Msc: 'niu', W: 'nie',
                        }),
                        new NounDeclension({
                            M: 'nie', D: 'niu', C: 'niu', B: 'nie', N: 'nium', Msc: 'nium', W: 'nie',
                        }),
                    ],
                    wnuczę: [
                        new NounDeclension({
                            M: 'czę', D: 'częcia', C: 'częciu', B: 'czę', N: 'częciem', Msc: 'częciu', W: 'czę',
                        }),
                        new NounDeclension({
                            M: 'czę', D: 'częciej', C: 'częciej', B: 'czę', N: 'częcią', Msc: 'częciej', W: 'czę',
                        }),
                        new NounDeclension({
                            M: 'czę', D: 'częcia', C: 'częciu', B: 'czę', N: 'częciem', Msc: 'częciu', W: 'czę',
                        }),
                        new NounDeclension({
                            M: 'czę', D: 'czu', C: 'czu', B: 'czę', N: 'czum', Msc: 'czum', W: 'czę',
                        }),
                    ],
                    Polko: [
                        new NounDeclension({
                            M: 'ko', D: 'ka', C: 'ku', B: 'ko', N: 'kiem', Msc: 'ku', W: 'ko',
                        }),
                        new NounDeclension({
                            M: 'ko', D: 'ki', C: 'ce', B: 'ko', N: 'ką', Msc: 'ce', W: 'ko',
                        }),
                        new NounDeclension({
                            M: 'ko', D: 'ka', C: 'ku', B: 'ko', N: 'kiem', Msc: 'ku', W: 'ko',
                        }),
                        new NounDeclension({
                            M: 'ko', D: 'ku', C: 'ku', B: 'ko', N: 'kum', Msc: 'kum', W: 'ko',
                        }),
                    ],
                    kociaro: [
                        new NounDeclension({
                            M: 'ro', D: 'ra', C: 'rzu', B: 'ro', N: 'rem', Msc: 'rzu', W: 'ro',
                        }),
                        new NounDeclension({
                            M: 'ro', D: 'rej', C: 'rej', B: 'ro', N: 'rą', Msc: 'rej', W: 'ro',
                        }),
                        new NounDeclension({
                            M: 'ro', D: 'ra', C: 'rzu', B: 'ro', N: 'rem', Msc: 'rzu', W: 'ro',
                        }),
                        new NounDeclension({
                            M: 'ro', D: 'ru', C: 'ru', B: 'ro', N: 'rum', Msc: 'rum', W: 'ro',
                        }),
                    ],
                },
            }
        },
    }
</script>
