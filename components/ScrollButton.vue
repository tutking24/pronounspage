<template>
    <div class="scroll-btn" @click.prevent="scroll" :style="`opacity: ${shown ? 1 : 0}`">
        <SquareButton link="#" :colour="colour" :aria-label="$t('table.scrollUp')">
            <Icon v="arrow-alt-up"/>
        </SquareButton>
    </div>
</template>

<script>
    export default {
        props: {
            colour: { 'default': null },
        },
        data() {
            return {
                shown: false,
            }
        },
        mounted() {
            if (process.client) {
                this.updateShown();
                window.addEventListener('scroll', _ => { this.updateShown(); });
            }
        },
        methods: {
            scroll() {
                document.body.scrollTop = 0;
                document.querySelector('html').scrollTop = 0;
            },
            updateShown() {
                const st = document.body.scrollTop || document.querySelector('html').scrollTop;
                this.shown = st > 300;
            }
        },
    }
</script>

<style lang="scss" scoped>
    @import "assets/variables";

    .scroll-btn {
        position: fixed;
        bottom: $spacer;
        right: $spacer;
        transition: all .5s ease-in-out;
        z-index: 1030;
    }
</style>
