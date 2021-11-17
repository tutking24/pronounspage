<template>
    <span>
        <Twemoji>
            <span v-for="part in example[(example.isHonorific ? pronoun.isPluralHonorific(counter) : pronoun.isPlural(counter)) ? 'pluralParts' : 'singularParts']">
                <strong v-if="part.variable"><Spelling escape :text="pronoun.getMorpheme(part.str, counter)"/></strong>
                <span v-else><Spelling :text="part.str"/></span>
            </span>
            <small v-if="link">
                (<nuxt-link :to="'/' + pronoun.canonicalName"><Spelling escape :text="pronoun.canonicalName"/></nuxt-link>)
            </small>
        </Twemoji>
        <template v-if="config.pronunciation.enabled && pronunciation && pronoun.pronounceable && example.pronounce(pronoun)">
            <a v-for="(pLink, name) in pronunciationLinks"
               class="mr-2"
               :href="pLink"
               @click.prevent="pronounce(pLink)">
                <Icon v="volume"/><sub v-if="name">{{name}}</sub>
            </a>
        </template>
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
            pronounce(link) {
                const sound = new Audio(link);
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
            pronunciationLinks() {
                const justOne = Object.keys(this.config.pronunciation.voices).length === 1;

                const links = {};
                for (let country in this.config.pronunciation.voices) {
                    if (!this.config.pronunciation.voices.hasOwnProperty(country)) { continue; }
                    links[justOne ? '' : country] = `/api/pronounce/${country}/${this.pronounToString}?example=${encodeURIComponent(this.example.toString())}`;
                }
                return links;
            }
        }
    }
</script>
