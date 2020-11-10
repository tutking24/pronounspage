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
                    <td>{{ selectedPronoun.getMorpheme('pronoun_n', counter) }}</td>
                    <td>{{ selectedPronoun.getMorpheme('pronoun_g', counter) }} / {{
                        selectedPronoun.getMorpheme('pronoun_g_acc', counter) }}</td>
                    <td>{{ selectedPronoun.getMorpheme('pronoun_d', counter) }}</td>
                    <td>{{ selectedPronoun.getMorpheme('pronoun_a', counter) }}</td>
                    <td>{{ selectedPronoun.getMorpheme('pronoun_i', counter) }}</td>
                    <td>{{ selectedPronoun.getMorpheme('pronoun_l', counter) }}</td>
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
                    <td>-{{ selectedPronoun.getMorpheme('verb_middle_inter', counter) }}{{selectedPronoun.isPlural(counter) ? 'śmy' : 'm'}}</td>
                    <td>-{{ selectedPronoun.getMorpheme('verb_middle_inter', counter) }}{{selectedPronoun.isPlural(counter) ? 'ście' : 'ś'}}</td>
                    <td>-{{ selectedPronoun.getMorpheme('verb_end_about', counter) }}</td>
                    <td>-{{ selectedPronoun.getMorpheme('adjective_n', counter) }}</td>
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
