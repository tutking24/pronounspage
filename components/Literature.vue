<template>
    <div v-if="sources.length">
        <h2 class="h4">
            <Icon v="books"/>
            Przykłady z literatury i prasy:
        </h2>

        <LiteratureMenu/>

        <ul class="list-unstyled">
            <li v-for="source in sources" class="my-2">
                <Source :source="source"/>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        props: {
            sources: { required: true },
        }
    }
</script>
