<template>
    <div>
        <div class="main-asides d-flex flex-column flex-xxl-row justify-content-center align-items-center align-items-xxl-start">
            <aside v-if="!wide" class="aside-left p-0 p-xxl-3">
                <slot name="aside-left">
                    <AdPlaceholder phkey="aside-left-middle" class="d-none d-xxl-block"/>
                </slot>
            </aside>
            <main :class="[wide ? 'wide' : '']">
                <slot/>
            </main>
            <aside v-if="!wide" class="aside-right">
                <slot name="aside-right">
                    <AdPlaceholder phkey="aside-right-middle"/>
                </slot>
            </aside>
        </div>
        <div class="d-flex justify-content-center">
            <main><slot name="below"></slot></main>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        wide: { type: Boolean },
    }
}
</script>

<style lang="scss" scoped>
@import "assets/variables";

main, aside {
    width: 100%;
    max-width: $container-width;
    padding: $spacer;
    margin-inline-start: $spacer;
    margin-inline-end: $spacer;
    &.wide {
        max-width: $container-width + 2 * $aside-width;
    }
}

@include media-breakpoint-up('xxl', $grid-breakpoints) {
    aside {
        max-width: $aside-width;
    }
}
</style>
