<template>
    <div>
        <h2>
            <Icon v="book"/>
            <T>nouns.headerLonger</T>
        </h2>

        <NounsNav/>

        <h3>
            <Icon v="ghost"/>
            <T>nouns.dukajNouns.header</T>
        </h3>

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
    </div>
</template>

<script>
    import {Noun, NounDeclension} from "../../../src/classes";
    import {head} from "../../../src/helpers";
    import NounsNav from "./NounsNav";

    export default {
        components: { NounsNav },
        data() {
            return {
                dukajNouns: [
                    new Noun({
                        id: 'astronauta',
                        masc: 'astronauta', fem: 'astronautka', neutr: 'astronautu',
                        mascPl: 'astronauci', femPl: 'astronautki', neutrPl: 'astronauty',
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
                    M_pl: 'y', D_pl: 'ych', C_pl: 'ym', B_pl: 'y', N_pl: 'umy', Msc_pl: 'ych', W_pl: 'y',
                }),
                dukajExtendedDeclension: new NounDeclension({
                    M: 'tenu kosmicznu twórcu',
                    D: 'tenu kosmicznenu twórcu',
                    C: 'tewu kosmicznewu twórcu',
                    B: 'tenu kosmicznenu twórcu',
                    N: 'tum kosmicznum twórcum',
                    Msc: 'tum kosmicznum twórcum',
                    W: 'tenu kosmicznu twórcu',

                    M_pl: 'teny kosmiczny twórcy',
                    D_pl: 'tenych kosmicznych twórcych',
                    C_pl: 'tenym kosmicznym twórcym',
                    B_pl: 'teny kosmiczneny twórcy',
                    N_pl: 'tumy kosmicznumy twórcumy',
                    Msc_pl: 'tumych kosmicznumych twórcych',
                    W_pl: 'teny kosmiczny twórcy',
                }),
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
