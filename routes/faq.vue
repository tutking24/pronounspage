<template>
    <div>
        <h2>
            <Icon v="map-marker-question"/>
            <T>faq.headerLong</T>
        </h2>

        <section>
            <Answer v-for="question in Object.keys($t('faq.questions'))" :key="question"
                    :question="question"
                    :id="question" :ref="question.replace(/-/g, '_')"
                    @click="setHash('', question)"
            />
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
                const $component = this.$refs[hash.replace(/-/g, '_')];
                if (!$component) {
                    return;
                }
                const $el = $component[0].$el;
                $el.open = true;
                $el.focus();
                $el.scrollIntoView();
                setTimeout(_ => {
                    $el.scrollIntoView();
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
