<template>
    <div>
        <h2>
            <Icon v="book"/>
            <T>nouns.headerLonger</T>
        </h2>

        <NounsNav/>

        <h3>
            <Icon v="deer"/>
            <T>nouns.neuterNouns.header</T>
        </h3>

        <div class="d-flex flex-column flex-md-row">
            <div>
                <T>nouns.neuterNouns.info</T>
                <p><Share :title="$t('nouns.neuterNouns.header')"/></p>
            </div>
            <figure>
                <img src="/img/łoś.jpg" :alt="$t('nouns.neuterNouns.flag.alt')"/>
                <figcaption><T>nouns.neuterNouns.flag.caption</T></figcaption>
            </figure>
        </div>

        <details class="border mb-3">
            <summary class="bg-light p-3">
                <h4 class="h5 d-inline"><T>nouns.neuterNouns.extended.header</T></h4>
            </summary>
            <div class="border-top">
                <div class="d-flex flex-column flex-md-row">
                    <div class="p-3">
                        <h5>⋅ <T>nouns.singular</T></h5>
                        <Declension word="" :template="neuterExtendedDeclension" open/>
                    </div>
                    <div class="p-3">
                        <h5>⁖ <T>nouns.plural</T></h5>
                        <Declension word="" :template="neuterExtendedDeclension" open plural/>
                    </div>
                </div>
            </div>
        </details>

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

        <Separator icon="atom-alt"/>

        <Dictionary load ref="dictionary"/>
    </div>
</template>

<script>
    import {Noun, NounDeclension} from "../../../src/classes";
    import hash from "../../../plugins/hash";
    import {head} from "../../../src/helpers";
    import NounsNav from "./NounsNav";

    export default {
        components: { NounsNav },
        mixins: [ hash ],
        data() {
            return {
                neuterExtendedDeclension: new NounDeclension({
                    M: 'to kosmiczne twórcze',
                    D: 'tego kosmicznego twórcza',
                    C: 'temu kosmicznemu twórczu',
                    B: 'to kosmiczne twórcze',
                    N: 'tym kosmicznym twórczem',
                    Msc: 'tym kosmicznym twórczu',
                    W: 'to kosmiczne twórcze',

                    M_pl: 'te kosmiczne twórcza',
                    D_pl: 'tych kosmicznych twórczy',
                    C_pl: 'tym kosmicznym twórczom',
                    B_pl: 'te kosmiczne twórcza',
                    N_pl: 'tymi kosmicznymi twórczami',
                    Msc_pl: 'tych kosmicznych twórczach',
                    W_pl: 'te kosmiczne twórcza',
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
        mounted() {
            this.handleHash(this.config.nouns.hashNamespace, filter => {
                this.$refs.dictionary.setFilter(filter);
            });
        },
        head() {
            return head({
                title: this.$t('nouns.neuterNouns.header'),
                description: this.$t('nouns.neuterNouns.info')[0],
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
