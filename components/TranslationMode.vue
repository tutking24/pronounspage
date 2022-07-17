<template>
    <div v-if="$isGranted()" class="scroll-btn d-print-none d-flex align-items-center">
        <template v-if="translationMode">
            <div class="bg-info rounded m-1 px-3 py-1 d-flex justify-content-center align-items-center">
                <small>Changes: {{ changesCount }}</small>
            </div>
            <div v-if="changesCount" @click.prevent="commitChanges">
                <SquareButton link="#" colour="success" aria-label="Commit changes">
                    <Icon v="check-circle"/>
                </SquareButton>
            </div>
            <div @click.prevent="revertChanges">
                <SquareButton link="#" colour="danger" aria-label="Revert changes">
                    <Icon v="times-circle"/>
                </SquareButton>
            </div>
        </template>
        <div v-else @click.prevent="startTranslating">
            <SquareButton link="#" colour="info" aria-label="Translation Mode">
                <Icon v="language"/>
            </SquareButton>
        </div>
    </div>
</template>

<script>
    import {mapState} from "vuex";

    export default {
        data() {
            return {
            }
        },
        methods: {
            startTranslating() {
                this.$store.commit('translationInit');
            },
            async commitChanges() {
                await this.$confirm(`Do you want to commit ${this.changesCount} changes?`, 'success');
                this.$store.commit('translationCommit');
            },
            async revertChanges() {
                if (this.changesCount) {
                    await this.$confirm(`Do you want to revert ${this.changesCount} changes?`, 'danger');
                }
                this.$store.commit('translationAbort');
            },
        },
        computed: {
            ...mapState([
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
        bottom: $spacer;
        right: 2 * $spacer + $square-button-size;
        z-index: 1030;
    }
</style>
