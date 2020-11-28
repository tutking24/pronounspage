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
                    <th>Mianownik</th>
                    <th>Dopełniacz</th>
                    <th>Celownik</th>
                    <th>Biernik</th>
                    <th>Narzędnik</th>
                    <th>Miejscownik</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td><Morpheme :pronoun="selectedPronoun" morpheme="pronoun_n" :counter="counter"/></td>
                    <td><Morpheme :pronoun="selectedPronoun" morpheme="pronoun_g" :counter="counter"/> / <Morpheme :pronoun="selectedPronoun" morpheme="pronoun_g_acc" :counter="counter"/></td>
                    <td><Morpheme :pronoun="selectedPronoun" morpheme="pronoun_d" :counter="counter"/></td>
                    <td><Morpheme :pronoun="selectedPronoun" morpheme="pronoun_a" :counter="counter"/></td>
                    <td><Morpheme :pronoun="selectedPronoun" morpheme="pronoun_i" :counter="counter"/></td>
                    <td><Morpheme :pronoun="selectedPronoun" morpheme="pronoun_l" :counter="counter"/></td>
                </tr>
                </tbody>
            </table>
        </div>

        <div class="table-responsive">
            <table class="table table-sm">
                <thead>
                <tr>
                    <th>1 os.</th>
                    <th>2 os.</th>
                    <th>3 os.</th>
                    <th>Przymiotniki</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>
                        <Morpheme :pronoun="selectedPronoun" morpheme="verb_middle_inter" :counter="counter"
                                  prepend="–"
                                  :append="selectedPronoun.isPlural(counter) ? 'śmy' : 'm'"
                                  :appendPr="selectedPronoun.isPlural(counter) ? 'ɕmɨ' : 'm'"
                        />
                    </td>
                    <td>
                        <Morpheme :pronoun="selectedPronoun" morpheme="verb_middle_inter" :counter="counter"
                                  prepend="–"
                                  :append="selectedPronoun.isPlural(counter) ? 'ście' : 'ś'"
                                  :appendPr="selectedPronoun.isPlural(counter) ? 'ɕʨ̑ɛ' : 'ɕ'"
                        />
                    </td>
                    <td><Morpheme :pronoun="selectedPronoun" morpheme="verb_end_about" :counter="counter" prepend="–"/></td>
                    <td><Morpheme :pronoun="selectedPronoun" morpheme="adjective_n" :counter="counter" prepend="–"/></td>
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
