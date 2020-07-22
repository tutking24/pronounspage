<template>
    <ul class="list-inline small">
        <li class="list-inline-item">
            <a href="https://twitter.com/VaultAusir" target="_blank" rel="noopener">
                <Icon v="book-reader"/>
                zebrane przez Pawła Dembowskiego
            </a>
        </li>
        <li class="list-inline-item">
            <a href="mailto:pawel.dembowski@gmail.com" target="_blank" rel="noopener">
                <Icon v="envelope-open-text"/>
                dodaj przykłady do listy
            </a>
        </li>
        <li class="list-inline-item" v-if="!all">
            <nuxt-link to="/literatura">
                <Icon v="books"/>
                zobacz przykłady dla innych form
            </nuxt-link>
        </li>
    </ul>
</template>

<script>
    export default {
        props: {
            all: { type: Boolean },
        }
    }
</script>
