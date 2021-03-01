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
                    <th>Именительный</th>
                    <th>Родительный</th>
                    <th>Дательный</th>
                    <th>Винителный</th>
                    <th>Творителный</th>
                    <th>Предложный</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td><Morpheme :pronoun="selectedPronoun" morpheme="pronoun_n" :counter="counter"/></td>
                    <td><Morpheme :pronoun="selectedPronoun" morpheme="pronoun_g" :counter="counter"/></td>
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
                    <th>1 ос.</th>
                    <th>2 ос..</th>
                    <th>3 ос.</th>
                    <th>Przymiotniki</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>
                        <Morpheme :pronoun="selectedPronoun" morpheme="verb_middle_inter" :counter="counter"
                                  prepend="–"
                                  :append="selectedPronoun.isPlural(counter) ? '' : ''"
                                  :appendPr="selectedPronoun.isPlural(counter) ? '' : ''"
                        />
                    </td>
                    <td>
                        <Morpheme :pronoun="selectedPronoun" morpheme="verb_middle_inter" :counter="counter"
                                  prepend="–"
                                  :append="selectedPronoun.isPlural(counter) ? '' : ''"
                                  :appendPr="selectedPronoun.isPlural(counter) ? '' : ''"
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
