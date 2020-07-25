<template>
    <div v-if="sources.length">
        <h2 class="h4">
            <Icon v="books"/>
            Przykłady z literatury, prasy, filmów i seriali:
        </h2>

        <LiteratureMenu/>

        <ul class="list-unstyled">
            <li v-for="source in sources" class="my-2">
                <Source :name="source"/>
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
