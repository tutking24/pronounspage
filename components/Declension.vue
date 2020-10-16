<template>
    <span>
        <template v-if="declensionTemplate">
            <a v-if="!open" href="#" @click.prevent="visible = !visible">{{ word }}</a>
            <ul v-if="visible" :class="['list-unstyled', 'small', open ? '' : 'm-2 p-2 border']">
                <li v-for="(declined, c) in declensionTemplate.decline(word, plural)" class="text-nowrap">
                    <strong>{{c}} <small v-if="!condense">({{cases[c]}})</small></strong> {{ declined.join(' / ') }}
                </li>
            </ul>
        </template>
        <template v-else>{{ word }}</template>
    </span>
</template>

<script>
    import { nounDeclensionTemplates } from "../src/data";
    import cases from "../data/nouns/cases";

    export default {
        props: {
            word: { required: true },
            plural: { type: Boolean },
            singularOptions: { },
            template: { },
            open: { type: Boolean },
            condense: { type: Boolean },
        },
        data() {
            return {
                declensionTemplate: this.template || this.findTemplate(),
                cases,
                visible: this.open,
            }
        },
        methods: {
            findTemplate() {
                let longestMatch = 0;
                let templates = [];
                for (let t of nounDeclensionTemplates) {
                    const matchLength = t.matches(this.word, this.plural);
                    if (matchLength === 0) {
                        continue;
                    }
                    if (matchLength > longestMatch) {
                        longestMatch = matchLength;
                        templates = [t];
                    } else if (matchLength === longestMatch) {
                        templates.push(t);
                    }
                }

                if (!templates.length) {
                    return null;
                } else if (templates.length === 1) {
                    return templates[0];
                } else if (this.plural && this.singularOptions) {
                    for (let t of templates) {
                        for (let s of this.singularOptions) {
                            if (t.matches(s)) {
                                return t;
                            }
                        }
                    }
                }

                return templates[0];
            },
        },
    };
</script>
