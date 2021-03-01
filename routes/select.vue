<template>
    <div>
        <div class="list-group">
            <a v-for="(options, locale) in locales" :key="locale" :href="options.url" class="list-group-item list-group-item-action list-group-item-hoverable">
                <div class="h3">
                    {{ options.name }}
                </div>
            </a>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    @import "assets/variables";

    .list-group-item-hoverable {
        &:hover {
            color: $primary;
            border-inline-start: 3px solid $primary;
            padding-inline-start: calc(#{$list-group-item-padding-x} - 2px);
        }
    }
</style>
