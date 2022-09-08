<template>
    <div>
        <div class="main-asides d-flex flex-column flex-xxl-row justify-content-center align-items-center align-items-xxl-start">
            <aside class="aside-left">
                <slot name="aside-left">
                    <AdPlaceholder phkey="aside-left-middle" class="d-none d-xxl-block"/>
                </slot>
            </aside>
            <main>
                <slot/>
            </main>
            <aside class="aside-right">
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

<style lang="scss" scoped>
@import "assets/variables";

main, aside {
    width: 100%;
    max-width: $container-width;
    padding: $spacer;
}

@include media-breakpoint-up('xxl', $grid-breakpoints) {
    aside {
        max-width: $aside-width;
    }
}
</style>
