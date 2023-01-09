<template>
    <div v-if="translationModeVisible && $user()" :class="['scroll-btn', 'd-print-none', 'd-flex', 'align-items-center', config.ads && config.ads.enabled ? 'higher' : '']">
        <template v-if="translationMode">
            <button class="btn btn-info btn-sm m-1 px-3 py-1 d-flex justify-content-center align-items-center" @click="showChanges">
                <small><T>translationMode.changes</T><T>quotation.colon</T> {{ changesCount }}</small>
            </button>
            <div v-if="changesCount" @click.prevent="commitChanges">
                <SquareButton link="#" colour="success" :title="$t('translationMode.commit')">
                    <Icon v="check-circle"/>
                </SquareButton>
            </div>
            <div v-if="changesCount" @click.prevent="revertChanges">
                <SquareButton link="#" colour="danger" :title="$t('translationMode.revert')">
                    <Icon v="times-circle"/>
                </SquareButton>
            </div>
            <div @click.prevent="pause">
                <SquareButton link="#" colour="info" :title="$t('translationMode.header')">
                    <Icon v="pause-circle"/>
                </SquareButton>
            </div>
        </template>
        <div v-else @click.prevent="startTranslating">
            <SquareButton link="#" colour="info" :title="$t('translationMode.header')">
                <Icon v="language"/>
            </SquareButton>
        </div>
    </div>
</template>

<script>
    import {mapState} from "vuex";
    import Suml from 'suml';

    export default {
        data() {
            return {
            }
        },
        mounted() {
            if (this.$isGranted('translations')) {
                this.$store.commit('showTranslationMode');
            }
        },
        methods: {
            startTranslating() {
                this.$store.commit('translationInit');
            },
            async commitChanges() {
                await this.$confirm(`Do you want to commit ${this.changesCount} changes?`, 'success');
                const response = await this.$post(`/translations/propose`, {
                    changes: this.translationChanges,
                });
                this.$store.commit('translationCommit');
                this.$cookies.remove('translations');

                setTimeout(
                    () => this.$alert({header: 'Your translation proposals were saved', message: 'Thank you for contributing!'}, 'success'),
                    500,
                )
            },
            async revertChanges() {
                if (this.changesCount) {
                    await this.$confirm(`Do you want to revert ${this.changesCount} changes?`, 'danger');
                }
                this.$store.commit('translationAbort');
                this.$cookies.remove('translations');
            },
            async showChanges() {
                await this.$alert({
                    header: 'Changes overview',
                    message: '<pre>' + new Suml().dump(this.translationChanges) + '</pre>',
                    margin: false,
                    size: 'lg',
                }, 'info');
            },
            async pause() {
                this.$store.commit('translationPause');
            },
        },
        computed: {
            ...mapState([
                'translationModeVisible',
                'translationMode',
                'translationChanges',
            ]),
            changesCount() {
                return Object.keys(this.translationChanges).length;
            },
        },
}
</script>

<style lang="scss" scoped>
    @import "assets/variables";

    .scroll-btn {
        position: fixed;
        bottom: 2 * $spacer + $square-button-size;
        right: $spacer;
        z-index: 1030;
    }

    @include media-breakpoint-down('lg', $grid-breakpoints) {
        .higher {
            bottom: 4 * $spacer + $square-button-size;
        }
    }
    @include media-breakpoint-up('lg', $grid-breakpoints) {
        .higher {
            z-index: 100001;
        }
    }
</style>
