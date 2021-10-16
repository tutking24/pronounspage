<template>
    <div>
        <LinksNav v-if="config.links.enabled"/>

        <h2 class="mb-4">
            <Icon v="map-marker-question"/>
            <T>faq.headerLong</T>
        </h2>

        <section>
            <div class="input-group mb-3 bg-white">
                <span class="input-group-text">
                    <Icon v="filter"/>
                </span>
                <input class="form-control border-primary" v-model="filter" :placeholder="$t('crud.filterLong')" ref="filter"/>
                <button v-if="filter" class="btn btn-outline-danger" @click="filter = ''; $refs.filter.focus()">
                    <Icon v="times"/>
                </button>
            </div>
        </section>

        <details class="border mb-3" open v-show="!filter || $t('home.mission.header').toLowerCase().includes(filter.toLowerCase())">
            <summary class="d-none"/>
            <div class="px-3">
                <Mission/>
            </div>
        </details>

        <Answer v-for="question in Object.keys($t('faq.questions'))" :key="question"
                :question="question"
                :id="question" :ref="question.replace(/-/g, '_')"
                @click="setHash('', question)"
                v-show="!filter
                     || $t(`faq.questions.${question}.question`).toLowerCase().includes(filter.toLowerCase())
                     || $t(`faq.questions.${question}.answer`).join('|').toLowerCase().includes(filter.toLowerCase())"
        />

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
        data() {
            return {
                filter: '',
            }
        },
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
    @import "assets/variables";

    details {
        summary {
            font-weight: bold;
        }
        &[open] {
            box-shadow: $box-shadow;
        }
    }
</style>
