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
                    <th>Nominativ</th>
                    <th>Acuzativ</th>
                    <th>Dativ</th>
                    <th>Genitiv</th>
                    <th>Pronumele reflexiv</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td><Morpheme :pronoun="selectedPronoun" morpheme="pronoun_subject" :counter="counter"/></td>
                    <td><Morpheme :pronoun="selectedPronoun" morpheme="pronoun_object" :counter="counter"/></td>
                    <td><Morpheme :pronoun="selectedPronoun" morpheme="possessive_determiner" :counter="counter"/></td>
                    <td><Morpheme :pronoun="selectedPronoun" morpheme="possessive_pronoun" :counter="counter"/></td>
                    <td><Morpheme :pronoun="selectedPronoun" morpheme="reflexive" :counter="counter"/></td>
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
