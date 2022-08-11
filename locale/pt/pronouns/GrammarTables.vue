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
                    <th></th>
                    <th>Artigo definido</th>
                    <th>Artigo indefinido</th>
                    <th>Pronome pessoal</th>
                    <th>Flexão</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <th>Singular</th>
                    <td><Morpheme :pronoun="selectedPronoun" morpheme="definite_article" :counter="counter"/></td>
                    <td><Morpheme :pronoun="selectedPronoun" morpheme="indefinite_article" :counter="counter"/></td>
                    <td><Morpheme :pronoun="selectedPronoun" morpheme="pronoun" :counter="counter"/></td>
                    <td><Morpheme :pronoun="selectedPronoun" morpheme="inflection" :counter="counter" prepend="-"/></td>
                </tr>
                <tr>
                    <th>Plural</th>
                    <td><Morpheme :pronoun="selectedPronoun" morpheme="plural_definite_article" :counter="counter"/></td>
                    <td><Morpheme :pronoun="selectedPronoun" morpheme="plural_indefinite_article" :counter="counter"/></td>
                    <td><Morpheme :pronoun="selectedPronoun" morpheme="plural_pronoun" :counter="counter"/></td>
                    <td><Morpheme :pronoun="selectedPronoun" morpheme="inflection" :counter="counter" prepend="-" append="s"/></td>
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
