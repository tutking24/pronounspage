<template>
    <div>
        <h2>
            <Icon v="map-marker-question"/>
            <T>faq.headerLong</T>
        </h2>

        <section>
            <details v-for="question in Object.keys($t('faq.questions'))" class="border mb-3" :id="question" :ref="question.replace(/-/g, '_')" @click="setHash('', question)">
                <summary class="bg-light p-3"><T>faq.questions.{{question}}.question</T></summary>
                <div class="p-3 border-top">
                    <T>faq.questions.{{question}}.answer</T>
                </div>
            </details>
        </section>

        <section>
            <Share :title="$t('faq.headerLong')"/>
        </section>
    </div>
</template>

<script>
    import { head } from "../src/helpers";
    import hash from "../plugins/hash";

    export default {
        mixins: [ hash ],
        mounted() {
            this.handleHash('', hash => {
                const $el = this.$refs[hash.replace(/-/g, '_')];
                if (!$el) {
                    return;
                }
                $el[0].open = true;
                $el[0].focus();
                $el[0].scrollIntoView();
                setTimeout(_ => {
                    $el[0].scrollIntoView();
                }, 1000);
            }, false)
        },
        head() {
            return head({
                title: this.$t('faq.headerLong'),
            });
        },
    };
</script>

<style lang="scss" scoped>
    details {
        summary {
            font-weight: bold;
        }
    }
</style>
