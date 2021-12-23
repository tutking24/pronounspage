<template>
    <NotFound v-if="pronounGroups === undefined"/>
    <div v-else>
        <h2>
            <Icon v="tag"/>
            <T>pronouns.intro</T><T>quotation.colon</T>
        </h2>

        <section>
            <div class="alert alert-primary">
                <h2 class="text-center mb-0">
                    <strong>
                        <T>pronouns.any.short</T>
                        <span v-if="groupKey">{{groupKey}}</span>
                    </strong>
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
                <T>pronouns.examples</T><T>quotation.colon</T>
            </h2>

            <ul>
                <li v-for="example in examples" class="my-1">
                    <Example :example="example" :pronoun="randomPronoun()" link/>
                </li>
            </ul>
        </section>

        <PronounGroup v-for="pronounGroup in pronounGroups" :key="pronounGroup.name" :pronounGroup="pronounGroup"/>

        <section>
            <Share :title="`${$t('pronouns.intro')}: ${$t('pronouns.any.short')}`"/>
        </section>

        <Separator icon="info"/>
        <section class="mb-0">
            <h2 class="h4">
                <Icon v="info-circle"/>
                <T>home.whatisit</T><T>quotation.colon</T>
            </h2>
            <T>home.about</T>
            <Homepage align="center"/>
        </section>
    </div>
</template>

<script>
    import { examples, pronouns, pronounLibrary } from "~/src/data";
    import { head } from "../src/helpers";

    export default {
        data() {
            const groupKey = this.$route.params.group;
            let pronounGroups = [];
            if (groupKey) {
                pronounGroups = pronounLibrary.byKey()[groupKey];
            }

            return {
                examples,
                groupKey,
                pronounGroups,
            }
        },
        head() {
            return head({
                title: `${this.$t('pronouns.intro')}: ${this.$t('pronouns.any.short')} ${this.groupKey || ''}`.trim(),
                banner: `api/banner/${this.$t('pronouns.any.short')}.png`,
            });
        },
        computed: {
            pronounsChoice() {
                if (!this.pronounGroups.length) {
                    return pronouns;
                }

                let choice = {};
                for (let pronounGroup of this.pronounGroups) {
                    choice = {...choice, ...pronounGroup.groupPronouns}
                }
                return choice;
            }
        },
        methods: {
            randomPronoun() {
                const keys = Object.keys(this.pronounsChoice);
                return this.pronounsChoice[keys[keys.length * Math.random() << 0]];
            },
        }
    }
</script>
