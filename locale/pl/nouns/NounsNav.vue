<template>
    <section>
        <div class="d-none d-md-inline-flex btn-group btn-block mb-2">
            <a v-for="(icon, name) in links" :href="'#' + $t(`nouns.${name}.id`)" class="btn btn-outline-primary">
                <Icon :v="icon"/>
                <T>nouns.{{name}}.header</T>
            </a>
        </div>
        <div class="d-block d-md-none btn-group-vertical btn-block mb-2">
            <a v-for="(icon, name) in links" :href="'#' + $t(`nouns.${name}.id`)" class="btn btn-outline-primary">
                <Icon :v="icon"/>
                <T>nouns.{{name}}.header</T>
            </a>
        </div>
    </section>
</template>

<script>
    export default {
        data() {
            return {
                links: {
                    neuterNouns: 'deer',
                    dukajNouns: 'ghost',
                    personNouns: 'user-friends',
                    // inclusive: 'book-heart',
                }
            };
        },
    }
</script>
