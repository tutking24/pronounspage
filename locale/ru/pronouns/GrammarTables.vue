<template>
    <section>
        <h2 class="h4">
            <Icon v="spell-check"/>
            Грамматика:
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
                    <th>Окончание невозвратных глаголов в пр. в.</th>
                    <th>Окончание возвратных глаголов в пр. в.</th>
                    <th>Окончание кратких прилагательных</th>
                    <th>Окончание прилагательных</th>
                    <th>Притяжательное местоимение</th>
                    <th>Определительное местоимение</th>
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
