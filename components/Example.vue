<template>
    <span>
        <span v-for="part in example[(example.isHonorific ? pronoun.isPluralHonorific(counter) : pronoun.isPlural(counter)) ? 'pluralParts' : 'singularParts']">
            <strong v-if="part.variable">{{pronoun.getMorpheme(part.str, counter)}}</strong>
            <span v-else>{{part.str}}</span>
        </span>
        <small v-if="link">
            (<nuxt-link :to="'/' + pronoun.canonicalName">{{ pronoun.canonicalName }}</nuxt-link>)
        </small>
        <a v-if="config.pronunciation.enabled && pronounce && pronoun.pronounceable && example.pronounce(pronoun)"
           :href="pronunciationLink"
           @click.prevent="pronounce">
            <Icon v="volume"/>
        </a>
    </span>
</template>

<script>
    import { pronouns } from "~/src/data";

    export default {
        props: {
            example: { required: true },
            pronoun: { required: true },
            counter: { default: 0 },
            link: { type: Boolean },
            pronunciation: { type: Boolean },
        },
        methods: {
            pronounce() {
                const sound = new Audio(this.pronunciationLink);
                sound.play();
            }
        },
        computed: {
            pronounBase() {
                const name = this.pronoun.name();
                for (let key in pronouns) {
                    if (!pronouns.hasOwnProperty(key)) { continue; }
                    if (key === name) {
                        return key;
                    }
                    for (let alias of pronouns[key].aliases) {
                        if (alias === name) {
                            return key;
                        }
                    }
                }

                return null;
            },
            pronounToString() {
                return this.pronounBase && pronouns[this.pronounBase].equals(this.pronoun) ? this.pronounBase : this.pronoun.toString();
            },
            pronunciationLink() {
                return `/api/pronounce/${this.pronounToString}?example=${encodeURIComponent(this.example.toString())}`;
            }
        }
    }
</script>
