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
                    Мы получи<strong>{{pronouns[pronoun].morphemes.verb_end_inter}}</strong>
                </td>
                <td v-else>
                    Я получи<strong>{{pronouns[pronoun].morphemes.verb_middle_inter}}</strong>
                </td>
                <td v-if="pronouns[pronoun].plural[0]">
                    Вы игра<strong>{{pronouns[pronoun].morphemes.verb_end_inter}}</strong>
                </td>
                <td v-else>
                    Ты грал<strong>{{pronouns[pronoun].morphemes.verb_end_about}}</strong>
                </td>
                <td v-if="pronouns[pronoun].plural[0]">
                    Они сказали <strong>{{pronouns[pronoun].morphemes.pronoun_d}}</strong>,
                    что <strong>{{pronouns[pronoun].morphemes.pronoun_n}}</strong> красив<strong>{{pronouns[pronoun].morphemes.adjective_n}}</strong>
                </td>
                <td v-else>
                    Они сказали <strong>{{pronouns[pronoun].morphemes.pronoun_d}}</strong>,
                    что <strong>{{pronouns[pronoun].morphemes.pronoun_n}}</strong> красив<strong>{{pronouns[pronoun].morphemes.adjective_n}}</strong>
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
