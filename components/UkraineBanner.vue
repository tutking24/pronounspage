<template>
    <div class="ukraine-banner p-2 border rounded">
        <strong><T>ukraine.header</T></strong>
        <br class="d-md-none"/>
        <T>ukraine.link</T>
    </div>
</template>


<style lang="scss">
@import "assets/variables";

.ukraine-banner {
    background-color: #025abc;
    background: linear-gradient(90deg, #025abc 40%, #fed602 60%);
    color: white;

    a {
        color: $white;
        text-decoration: underline;
    }
}
</style>
