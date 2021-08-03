<template>
    <div>
        <NounsNav/>

        <h2>
            <Icon v="ghost"/>
            <T>nouns.dukajNouns.header</T>
        </h2>

        <div class="d-flex flex-column flex-md-row">
            <div>
                <T>nouns.dukajNouns.info</T>
                <p><Share :title="$t('nouns.dukajNouns.header')"/></p>
            </div>
            <figure>
                <img src="/img/dukaizmy.png" :alt="$t('nouns.dukajNouns.flag.alt')"/>
                <figcaption><T>nouns.dukajNouns.flag.caption</T></figcaption>
            </figure>
        </div>

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
                                    <Declension :word="w" :template="noun.declension"/>
                                </li>
                            </ul>
                            <ul class="list-plural">
                                <li v-for="w in noun.neutrPl">
                                    <Declension :word="w" plural :singularOptions="noun.neutr" :template="noun.declension"/>
                                </li>
                            </ul>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </details>

        <details open class="border mb-3">
            <summary class="bg-light p-3">
                <h4 class="h5 d-inline"><T>nouns.dukajNouns.extended.header</T></h4>
            </summary>
            <div class="border-top">
                <div class="d-flex flex-column flex-md-row">
                    <div class="p-3">
                        <h5>⋅ <T>nouns.singular</T></h5>
                        <Declension word="" :template="dukajExtendedDeclension" open/>
                    </div>
                    <div class="p-3">
                        <h5>⁖ <T>nouns.plural</T></h5>
                        <Declension word="" :template="dukajExtendedDeclension" open plural/>
                    </div>
                </div>
            </div>
        </details>

        <details open class="border mb-3">
            <summary class="bg-light p-3">
                <h4 class="h5 d-inline">Generator</h4>
            </summary>
            <div class="border-top p-3">
                <p>
                    Końcówki dukatywów są tak regularne, że zamiast pełnego słownika
                    powinien wystarczyć nawet automatyczny generator.
                </p>
                <p>
                    Wpisz poniżej dowolny rzeczownik określający osobę,
                    <strong>w rodzaju męskim liczby pojedynczej</strong>:
                </p>
                <div class="form-group">
                    <input v-model="generatorWord" class="form-control" placeholder="Wpisz rzeczownik w rodzaju męskim liczby pojedynczej"/>
                </div>
                <table v-if="generatorResult" class="table table-fixed-3">
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
                    <tr>
                        <td>
                            <ul class="list-singular">
                                <li v-for="w in generatorResult.masc">{{ w }}</li>
                            </ul>
                            <ul class="list-plural">
                                <li v-for="w in generatorResult.mascPl">{{ w }}</li>
                            </ul>
                        </td>
                        <td>
                            <ul class="list-singular">
                                <li v-for="w in generatorResult.fem">{{ w }}</li>
                            </ul>
                            <ul class="list-plural">
                                <li v-for="w in generatorResult.femPl">{{ w }}</li>
                            </ul>
                        </td>
                        <td>
                            <ul class="list-singular">
                                <li v-for="w in generatorResult.neutr">
                                    <Declension :word="w" :template="generatorResult.declension"/>
                                </li>
                            </ul>
                            <ul class="list-plural">
                                <li v-for="w in generatorResult.neutrPl">
                                    <Declension :word="w" :template="generatorResult.declension" plural/>
                                </li>
                            </ul>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <div v-else class="alert alert-warning">
                    <p class="mb-0">Niestety, podane słowo nie pasuje do żadnego naszego szablonu</p>
                </div>
            </div>
        </details>

        <section v-if="sources && Object.keys(sources).length">
            <Literature :sources="sources"/>
        </section>
    </div>
</template>

<script>
    import {Noun, NounDeclension, SourceLibrary} from "../../../src/classes";
    import {head} from "../../../src/helpers";
    import NounsNav from "./NounsNav";
    import templates from './dukatywy.tsv';

    const dukajDeclension = new NounDeclension({
        M: 'u', D: 'u', C: 'u', B: 'u', N: 'um', Msc: 'um', W: 'u',
        M_pl: 'y', D_pl: 'ych', C_pl: 'ym', B_pl: 'ych', N_pl: 'ymi', Msc_pl: 'ych', W_pl: 'y',
    });
    const dukajAdjectiveDeclension = new NounDeclension({
        M: 'u', D: 'enu', C: 'ewu', B: 'enu', N: 'um', Msc: 'um', W: 'u',
        M_pl: 'y', D_pl: 'ych', C_pl: 'ym', B_pl: 'ych', N_pl: 'ymi', Msc_pl: 'ych', W_pl: 'y',
    });

    export default {
        components: { NounsNav },
        data() {
            return {
                dukajNouns: [
                    new Noun({
                        id: 'astronauta',
                        masc: 'astronauta', fem: 'astronautka', neutr: 'astronautu',
                        mascPl: 'astronauci', femPl: 'astronautki', neutrPl: 'astronauty',
                        declension: dukajDeclension,
                    }),
                    new Noun({
                        id: 'Europejczyk',
                        masc: 'Europejczyk', fem: 'Europejka', neutr: 'Europejku',
                        mascPl: 'Europejczycy', femPl: 'Europejki', neutrPl: 'Europejki',
                        declension: dukajDeclension,
                    }),
                    new Noun({
                        id: 'przyjaciel',
                        masc: 'przyjaciel', fem: 'przyjaciółka', neutr: 'przyjaciołu',
                        mascPl: 'przyjaciele', femPl: 'przyjaciółki', neutrPl: 'przyjacioły',
                        declension: dukajDeclension,
                    }),
                    new Noun({
                        id: 'twórca',
                        masc: 'twórca', fem: 'twórczyni', neutr: 'twórcu',
                        mascPl: 'twórcy', femPl: 'twórczynie', neutrPl: 'twórcy',
                        declension: dukajDeclension,
                    }),
                    new Noun({
                        id: 'radny',
                        masc: 'radny', fem: 'radna', neutr: 'radnu',
                        mascPl: 'radni', femPl: 'radne', neutrPl: 'radny',
                        declension: dukajAdjectiveDeclension,
                    }),
                ],
                dukajDeclension,
                dukajAdjectiveDeclension,
                dukajExtendedDeclension: new NounDeclension({
                    M: 'tenu kosmicznu twórcu',
                    D: 'tenu kosmicznenu twórcu',
                    C: 'tewu kosmicznewu twórcu',
                    B: 'tenu kosmicznenu twórcu',
                    N: 'tum kosmicznum twórcum',
                    Msc: 'tum kosmicznum twórcum',
                    W: 'ty kosmicznu twórcu',

                    M_pl: 'teny kosmiczny twórcy',
                    D_pl: 'tych kosmicznych twórcych',
                    C_pl: 'tym kosmicznym twórcym',
                    B_pl: 'tych kosmicznych twórcych',
                    N_pl: 'tymi kosmicznymi twórcymi',
                    Msc_pl: 'tych kosmicznych twórcych',
                    W_pl: 'wy kosmiczny twórcy',
                }),
                sources: undefined,
                templates,
                generatorWord: 'fotograf',
            }
        },
        async mounted() {
            this.sources = {
                '': new SourceLibrary(await this.$axios.$get(`/sources?pronoun=dukatywy`)).getForPronoun('dukatywy'),
            };
        },
        computed: {
            template() {
                let longestMatch = 0;
                let matchingTemplates = [];
                for (let t of templates) {
                    if (!this.generatorWord.endsWith(t.masc)) {
                        continue;
                    }
                    if (t.masc.length > longestMatch) {
                        longestMatch = t.masc.length;
                        matchingTemplates = [t];
                    } else if (t.masc.length === longestMatch) {
                        matchingTemplates.push(t);
                    }
                }

                if (!matchingTemplates.length) {
                    return null;
                }

                return matchingTemplates[0];
            },
            generatorResult() {
                if (!this.template) {
                    return null;
                }

                const root = this.generatorWord.substring(0, this.generatorWord.length - this.template.masc.length);

                const result = {id: null};
                for (let k in this.template) {
                    if (!this.template.hasOwnProperty(k)) { continue; }
                    result[k] = this.template[k].split('/').map(ending => root + ending).join(' / ');
                }

                result.declension = this.generatorWord.endsWith('y') || this.generatorWord.endsWith('i')
                    ? dukajAdjectiveDeclension
                    : dukajDeclension;

                return new Noun(result);
            }
        },
        head() {
            return head({
                title: this.$t('nouns.dukajNouns.header'),
                description: this.$t('nouns.dukajNouns.info')[0],
            });
        },
    }
</script>

<style lang="scss" scoped>
    @import "assets/variables";

    figure {
        width: 100%;
        max-width: 24rem;
        padding: $spacer;
        img {
            width: 100%;
        }
        figcaption {
            font-size: $small-font-size;
        }
    }
</style>
