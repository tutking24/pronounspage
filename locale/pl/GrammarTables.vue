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
                    <td>{{ selectedTemplate.getMorpheme('pronoun_n', counter) }}</td>
                    <td>{{ selectedTemplate.getMorpheme('pronoun_g', counter) }} / {{ selectedTemplate.getMorpheme('pronoun_g_acc', counter) }}</td>
                    <td>{{ selectedTemplate.getMorpheme('pronoun_d', counter) }}</td>
                    <td>{{ selectedTemplate.getMorpheme('pronoun_a', counter) }}</td>
                    <td>{{ selectedTemplate.getMorpheme('pronoun_i', counter) }}</td>
                    <td>{{ selectedTemplate.getMorpheme('pronoun_l', counter) }}</td>
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
                    <td>-{{ selectedTemplate.getMorpheme('verb_middle_inter', counter) }}{{ selectedTemplate.plural ? 'śmy' : 'm'}}</td>
                    <td>-{{ selectedTemplate.getMorpheme('verb_middle_inter', counter) }}{{ selectedTemplate.plural ? 'ście' : 'ś'}}</td>
                    <td>-{{ selectedTemplate.getMorpheme('verb_end_about', counter) }}</td>
                    <td>-{{ selectedTemplate.getMorpheme('adjective_n', counter) }}</td>
                </tr>
                </tbody>
            </table>
        </div>
    </section>
</template>

<script>
    export default {
        props: {
            selectedTemplate: { required: true },
            counter: { required: true },
        }
    }
</script>
