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
            <tr v-for="(description, template) in t">
                <th>
                    <nuxt-link :to="'/' + templates[template].canonicalName">
                        {{templates[template].name()}}
                        <br v-if="description"/>
                        <small>{{description}}</small>
                    </nuxt-link>
                </th>
                <td v-if="templates[template].plural">
                    Dosta<strong>{{templates[template].morphemes.verb_end_inter}}śmy</strong>
                </td>
                <td v-else>
                    Dostał<strong>{{templates[template].morphemes.verb_middle_inter}}m</strong>
                </td>
                <td v-if="templates[template].plural">
                    Gra<strong>{{templates[template].morphemes.verb_end_inter}}ście</strong>
                </td>
                <td v-else>
                    Grał<strong>{{templates[template].morphemes.verb_middle_inter}}ś</strong>
                </td>
                <td v-if="templates[template].plural">
                    Powiedzieli <strong>{{templates[template].morphemes.pronoun_d}}</strong>,
                    że [<strong>{{templates[template].morphemes.pronoun_n}}</strong>]
                    są ładn<strong>{{templates[template].morphemes.adjective_n}}</strong>
                </td>
                <td v-else>
                    Powiedzieli <strong>{{templates[template].morphemes.pronoun_d}}</strong>,
                    że [<strong>{{templates[template].morphemes.pronoun_n}}</strong>]
                    jest ładn<strong>{{templates[template].morphemes.adjective_n}}</strong>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    import { templates } from "../../src/data";
    import { getTemplate } from "../../src/buildTemplate";
    import { buildDict } from "../../src/helpers";

    export default {
        props: {
            t: { required: true },
        },
        data() {
            const that = this;
            return {
                templates: buildDict(function* () {
                    for (let name in that.t) {
                        if (!that.t.hasOwnProperty(name)) {
                            continue;
                        }
                        yield [name, getTemplate(templates, name)];
                    }
                }),
            };
        },
    }
</script>
