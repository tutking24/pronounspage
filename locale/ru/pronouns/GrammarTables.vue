<template>
    <section>
        <h2 class="h4">
            <Icon v="spell-check"/>
            Odmiana:
        </h2>

        <div class="table-responsive">
            <table class="table table-sm">
                <thead>
                <tr>
                    <th>именительный</th>
                    <th>родительный</th>
                    <th>дательный</th>
                    <th>винительный</th>
                    <th>творительный</th>
                    <th>предложный</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td><Morpheme :pronoun="selectedPronoun" morpheme="nominative" :counter="counter"/></td>
                    <td><Morpheme :pronoun="selectedPronoun" morpheme="genitive" :counter="counter"/></td> / <td><Morpheme :pronoun="selectedPronoun" morpheme="genitive_with_preposition" :counter="counter"/>
                    <td><Morpheme :pronoun="selectedPronoun" morpheme="dative" :counter="counter"/></td>
                    <td><Morpheme :pronoun="selectedPronoun" morpheme="accusative" :counter="counter"/></td>
                    <td><Morpheme :pronoun="selectedPronoun" morpheme="instrumental" :counter="counter"/></td> / <td><Morpheme :pronoun="selectedPronoun" morpheme="instrumental_with_preposition" :counter="counter"/></td>
                    <td><Morpheme :pronoun="selectedPronoun" morpheme="prepositional" :counter="counter"/></td>
                </tr>
                </tbody>
            </table>
        </div>

        <div class="table-responsive">
            <table class="table table-sm">
                <thead>
                <tr>
                    <th>Nonreflexive verb past</th>
                    <th>Reflexive verb past</th>
                    <th>Short adjective</th>
                    <th>Adjective</th>
                    <th>Possessive</th>
                    <th>Definitive</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td><Morpheme :pronoun="selectedPronoun" morpheme="nonreflexive_verb_past" :counter="counter" prepend="–"/></td>
                    <td><Morpheme :pronoun="selectedPronoun" morpheme="reflexive_verb_past" :counter="counter" prepend="–"/></td>
                    <td><Morpheme :pronoun="selectedPronoun" morpheme="short_adjective" :counter="counter" prepend="–"/></td>
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
