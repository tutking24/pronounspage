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
                    <th>Subjekt</th>
                    <th>Objekt</th>
                    <th>Possessiv</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td><Morpheme :pronoun="selectedPronoun" morpheme="pronoun_nominative" :counter="counter"/></td>
                    <td><Morpheme :pronoun="selectedPronoun" morpheme="pronoun_object" :counter="counter"/></td>
                    <td><Morpheme :pronoun="selectedPronoun" morpheme="possessive" :counter="counter"/></td>
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
