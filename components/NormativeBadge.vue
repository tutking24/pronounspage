<template>
    <span class="badge bg-secondary toggle-hover">
        <Icon v="book-open"/>
        <span class="togglable"><T>pronouns.normative</T></span>
    </span>
</template>

<style lang="scss" scoped>
    .toggle-hover {
        .togglable {
            display: none;
        }
        &:hover {
            .togglable {
                display: inline;
            }
        }
    }
</style>
