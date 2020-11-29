<template>
    <div>
        <h2>
            <Icon v="tag"/>
            <T>pronouns.intro</T>:
        </h2>

        <section>
            <div class="alert alert-primary">
                <h2 class="text-center mb-0">
                    <strong><T>pronouns.any.short</T></strong>
                </h2>
                <p class="h6 small text-center mb-0 mt-2">
                    <em>
                        <T>pronouns.any.description</T>
                        (<T>pronouns.any.options</T>)
                    </em>
                </p>
            </div>
        </section>

        <section>
            <h2 class="h4">
                <Icon v="file-signature"/>
                <T>pronouns.examples</T>:
            </h2>

            <ul>
                <li v-for="example in examples" class="my-1">
                    <Example :example="example" :pronoun="randomPronoun()" link/>
                </li>
            </ul>
        </section>

        <section>
            <Share :title="`${$t('pronouns.intro')}: ${$t('pronouns.any.short')}`"/>
        </section>

        <Separator icon="info"/>
        <section class="mb-0">
            <h2 class="h4">
                <Icon v="info-circle"/>
                <T>home.whatisit</T>:
            </h2>
            <T>home.about</T>
            <Homepage align="center"/>
        </section>
    </div>
</template>

<script>
    import { examples, pronouns } from "~/src/data";
    import { head } from "../src/helpers";

    export default {
        data() {
            return {
                examples: examples,
            }
        },
        head() {
            return head({
                title: `${this.$t('pronouns.intro')}: ${this.$t('pronouns.any.short')}`,
                banner: `api/banner/${this.$t('pronouns.any.short')}.png`,
            });
        },
        methods: {
            randomPronoun() {
                const keys = Object.keys(pronouns);
                return pronouns[keys[keys.length * Math.random() << 0]];
            },
        }
    }
</script>
