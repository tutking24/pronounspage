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
                    <th>Subject</th>
                    <th>Object</th>
                    <th>Possessive determiner</th>
                    <th>Possessive pronoun</th>
                    <th>Reflexive</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>{{ selectedTemplate.getMorpheme('pronoun_subject', counter) }}</td>
                    <td>{{ selectedTemplate.getMorpheme('pronoun_object', counter) }}</td>
                    <td>{{ selectedTemplate.getMorpheme('possessive_determiner', counter) }}</td>
                    <td>{{ selectedTemplate.getMorpheme('possessive_pronoun', counter) }}</td>
                    <td>{{ selectedTemplate.getMorpheme('reflexive', counter) }}</td>
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
