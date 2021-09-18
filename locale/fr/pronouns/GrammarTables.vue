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
                    <th>Sujet</th>
                    <th>Objet direct</th>
                    <th>Objet indirect</th>
                    <th>Possessif</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td><Morpheme :pronoun="selectedPronoun" morpheme="pronoun_subject" :counter="counter"/></td>
                    <td><Morpheme :pronoun="selectedPronoun" morpheme="pronoun_object" :counter="counter"/></td>
                    <td><Morpheme :pronoun="selectedPronoun" morpheme="pronoun_disjunctive" :counter="counter"/></td>
                    <td><Morpheme :pronoun="selectedPronoun" morpheme="pronoun_possessive" :counter="counter"/></td>
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
