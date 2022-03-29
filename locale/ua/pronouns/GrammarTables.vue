<template>
    <section>
        <h2 class="h4">
            <Icon v="spell-check"/>
            Граматика:
        </h2>

        <div class="table-responsive">
            <table class="table table-sm">
                <thead>
                <tr>
                    <th>називний</th>
                    <th>родовий</th>
                    <th>давальний</th>
                    <th>знахідний</th>
                    <th>орудний</th>
                    <th>місцевий</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td><Morpheme :pronoun="selectedPronoun" morpheme="nominative" :counter="counter"/></td>
                    <td><Morpheme :pronoun="selectedPronoun" morpheme="genitive" :counter="counter"/> / <Morpheme :pronoun="selectedPronoun" morpheme="genitive_with_preposition" :counter="counter"/>
                    <td><Morpheme :pronoun="selectedPronoun" morpheme="dative" :counter="counter"/></td>
                    <td><Morpheme :pronoun="selectedPronoun" morpheme="accusative" :counter="counter"/></td>
                    <td><Morpheme :pronoun="selectedPronoun" morpheme="instrumental" :counter="counter"/> / <Morpheme :pronoun="selectedPronoun" morpheme="instrumental_with_preposition" :counter="counter"/></td>
                    <td><Morpheme :pronoun="selectedPronoun" morpheme="prepositional" :counter="counter"/></td>
                </tr>
                </tbody>
            </table>
        </div>

        <div class="table-responsive">
            <table class="table table-sm">
                <thead>
                <tr>
                    <th>Закінчення незворотніх дієслів</th>
                    <th>Закінчення зворотніх дієслів</th>
                    <th>Закінчення прикметників</th>
                    <th>Присвійний займенник</th>
                    <th>Означальний займенник</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td><Morpheme :pronoun="selectedPronoun" morpheme="nonreflexive_verb_past" :counter="counter" prepend="–"/></td>
                    <td><Morpheme :pronoun="selectedPronoun" morpheme="reflexive_verb_past" :counter="counter" prepend="–"/></td>
                    <td><Morpheme :pronoun="selectedPronoun" morpheme="adjective" :counter="counter" prepend="–"/></td>
                    <td><Morpheme :pronoun="selectedPronoun" morpheme="possessive" :counter="counter"/></td>
                    <td><Morpheme :pronoun="selectedPronoun" morpheme="definitive" :counter="counter"/></td>                    
                </tr>
                </tbody>
            </table>
        </div>
    </section>
</template>

<script>
    export default {
        props: {
            selectedPronoun: { required: true },
            counter: { required: true },
        }
    }
</script>
