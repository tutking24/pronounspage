<template>
    <header class="d-flex justify-content-between mb-3">
        <h1 class="h4">
            <nuxt-link to="/">
                <Icon v="tags"/>
                Zaimki.pl
            </nuxt-link>
        </h1>
        <p :class="['text-' + align, 'mb-0']">
            <nuxt-link to="/" class="btn btn-outline-primary btn-sm">
                <Icon v="home"/>
                Strona główna
            </nuxt-link>
        </p>
    </header>
</template>

<script>
    export default {
    }
</script>
