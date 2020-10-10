<template>
    <div class="container">
        <h2>
            <Icon v="map-marker-question"/>
            <T>faq.headerLong</T>
        </h2>

        <section>
            <details v-for="question in config.faq.questions" class="border mb-3" :id="question" :ref="question">
                <summary class="bg-light p-3"><T>faq.questions.{{question}}.question</T></summary>
                <div class="p-3 border-top">
                    <T>faq.questions.{{question}}.answer</T>
                </div>
            </details>
        </section>
    </div>
</template>

<script>
    import { head } from "../src/helpers";

    export default {
        mounted() {
            if (process.client && window.location.hash) {
                const active = decodeURIComponent(window.location.hash.substr(1));
                const $el = this.$refs[active];
                if (!$el) {
                    return;
                }
                $el[0].open = true;
                $el[0].focus();
                $el[0].scrollIntoView();
                setTimeout(_ => {
                    $el[0].scrollIntoView();
                }, 1000);
            }
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
