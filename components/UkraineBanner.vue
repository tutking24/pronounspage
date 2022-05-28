<template>
    <div class="ukraine-banner p-2 border rounded">
        <strong><T>ukraine.header</T></strong>
        <br class="d-md-none"/>
        <T>ukraine.link</T>
    </div>
</template>

<style lang="scss">
@import "assets/variables";

$ukraine-blue: #025abc;
$ukraine-golden: #fed602;

.ukraine-banner {
    background-color: $ukraine-blue;
    background: linear-gradient(90deg, $ukraine-blue 40%, $ukraine-golden 60%);
    color: $white;
    text-shadow: 2px 2px 2px rgba($black, .5);

    a {
        color: $white;
        text-decoration: underline;
    }
}

body[data-theme="dark"] .ukraine-banner a {
    color: $white;
    text-decoration: underline;
}
</style>
