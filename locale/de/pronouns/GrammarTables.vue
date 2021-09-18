<template>
    <section>
        <h2 class="h4">
            <Icon v="spell-check"/>
            <T>pronouns.grammarTable</T>:
        </h2>

        <div class="table-responsive">
            <table class="table table-sm">
                <thead>
                <tr>
                    <th></th>
                    <th>Nominativ</th>
                    <th>Genitiv</th>
                    <th>Dativ</th>
                    <th>Akkusativ</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <th>Pronomen</th>
                    <td><Morpheme :pronoun="selectedPronoun" morpheme="pronoun_n" :counter="counter"/></td>
                    <td><Morpheme :pronoun="selectedPronoun" morpheme="pronoun_g" :counter="counter"/></td>
                    <td><Morpheme :pronoun="selectedPronoun" morpheme="pronoun_d" :counter="counter"/></td>
                    <td><Morpheme :pronoun="selectedPronoun" morpheme="pronoun_a" :counter="counter"/></td>
                </tr>
                <tr v-if="selectedPronoun.getMorpheme('article_n', counter)">
                    <th>Relativpronomen</th>
                    <td><Morpheme :pronoun="selectedPronoun" morpheme="article_n" :counter="counter"/></td>
                    <td><Morpheme :pronoun="selectedPronoun" morpheme="article_g" :counter="counter"/></td>
                    <td><Morpheme :pronoun="selectedPronoun" morpheme="article_d" :counter="counter"/></td>
                    <td><Morpheme :pronoun="selectedPronoun" morpheme="article_a" :counter="counter"/></td>
                </tr>
                <!--
                <tr v-if="selectedPronoun.getMorpheme('demonstrative_n', counter)">
                    <th>Demonstrativpronomen</th>
                    <td><Morpheme :pronoun="selectedPronoun" morpheme="demonstrative_n" :counter="counter"/></td>
                    <td><Morpheme :pronoun="selectedPronoun" morpheme="demonstrative_g" :counter="counter"/></td>
                    <td><Morpheme :pronoun="selectedPronoun" morpheme="demonstrative_d" :counter="counter"/></td>
                    <td><Morpheme :pronoun="selectedPronoun" morpheme="demonstrative_a" :counter="counter"/></td>
                </tr>
                -->
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
