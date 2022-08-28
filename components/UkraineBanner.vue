<template>
    <div class="ukraine-banner p-2 rounded bg-white">
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
    //border-top: 3px solid linear-gradient(90deg, $ukraine-blue 40%, $ukraine-golden 60%);
    //background-color: $ukraine-blue;
    //background: linear-gradient(90deg, $ukraine-blue 40%, $ukraine-golden 60%);
    //color: $white;
    //text-shadow: 2px 2px 2px rgba($black, .5);

    border: 1px solid $border-color;
    border-top: 5px solid;
    border-image-slice: 1;
    border-image-source: linear-gradient(90deg, $ukraine-blue 40%, $ukraine-golden 60%);

    a {
        //color: $white;
        text-decoration: underline;
    }
}

body[data-theme="dark"] .ukraine-banner a {
    color: $white;
    text-decoration: underline;
}
</style>
