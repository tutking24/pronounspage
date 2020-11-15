<template>
    <div class="table-responsive">
        <table class="table text-nowrap">
            <thead>
            <tr>
                <th></th>
                <th><em>I received</em></th>
                <th><em>You played</em></th>
                <th><em>Somebody told them they are pretty</em></th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(description, pronoun) in t">
                <th>
                    <nuxt-link :to="'/' + pronouns[pronoun].canonicalName">
                        {{pronouns[pronoun].name()}}
                        <br v-if="description"/>
                        <small>{{description}}</small>
                    </nuxt-link>
                </th>
                <td v-if="pronouns[pronoun].plural[0]">
                    Dosta<strong>{{pronouns[pronoun].morphemes.verb_end_inter}}śmy</strong>
                </td>
                <td v-else>
                    Dostał<strong>{{pronouns[pronoun].morphemes.verb_middle_inter}}m</strong>
                </td>
                <td v-if="pronouns[pronoun].plural[0]">
                    Gra<strong>{{pronouns[pronoun].morphemes.verb_end_inter}}ście</strong>
                </td>
                <td v-else>
                    Grał<strong>{{pronouns[pronoun].morphemes.verb_middle_inter}}ś</strong>
                </td>
                <td v-if="pronouns[pronoun].plural[0]">
                    Powiedzieli <strong>{{pronouns[pronoun].morphemes.pronoun_d}}</strong>,
                    że [<strong>{{pronouns[pronoun].morphemes.pronoun_n}}</strong>]
                    są ładn<strong>{{pronouns[pronoun].morphemes.adjective_n}}</strong>
                </td>
                <td v-else>
                    Powiedzieli <strong>{{pronouns[pronoun].morphemes.pronoun_d}}</strong>,
                    że [<strong>{{pronouns[pronoun].morphemes.pronoun_n}}</strong>]
                    jest ładn<strong>{{pronouns[pronoun].morphemes.adjective_n}}</strong>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    import { pronouns } from "../../../src/data";
    import { getPronoun } from "../../../src/buildPronoun";
    import { buildDict } from "../../../src/helpers";

    export default {
        props: {
            t: { required: true },
        },
        data() {
            const that = this;
            return {
                pronouns: buildDict(function* () {
                    for (let name in that.t) {
                        if (!that.t.hasOwnProperty(name)) {
                            continue;
                        }
                        yield [name, getPronoun(pronouns, name)];
                    }
                }),
            };
        },
    }
</script>
