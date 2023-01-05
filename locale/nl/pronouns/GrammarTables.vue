<template>
    <section>
        <h2 class="h4">
            <Icon v="spell-check"/>
            <T>pronouns.grammarTable</T><T>quotation.colon</T>
        </h2>

        <div class="table-responsive">
            <table class="table table-sm">
                <thead>
                <tr>
                    <th>Onderwerp</th>
                    <th>Lijdend voorwerp</th>
                    <th>Meewerkend voorwerp</th>
                    <th>Bezittelijk (bijvoeglijk)</th>
                    <th>Bezittelijk (zelfstandig)</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td><Morpheme :pronoun="selectedPronoun" morpheme="nominative" :counter="counter"/></td>
                    <td><Morpheme :pronoun="selectedPronoun" morpheme="accusative" :counter="counter"/></td>
                    <td><Morpheme :pronoun="selectedPronoun" morpheme="dative" :counter="counter"/></td>
                    <td><Morpheme :pronoun="selectedPronoun" morpheme="pronominal_poss" :counter="counter"/></td>
                    <td><Morpheme :pronoun="selectedPronoun" morpheme="predicative_poss" :counter="counter"/></td>
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
