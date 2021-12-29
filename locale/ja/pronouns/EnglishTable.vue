<template>
    <div class="table-responsive">
        <table class="table text-nowrap">
            <thead>
            <tr>
                <th>Japanese</th>
                <th v-if="t[0].formal !== undefined">Formal?</th>
                <th>Romanised</th>
                <th>IPA pronunciation</th>
                <th>Meaning</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="{pronoun, formal, romanised, ipa, meaning} in t">
                <th>
                    <LinkedText :text="pronoun"/>
                </th>
                <td v-if="formal !== undefined">
                    {{ formal ? 'Yes' : 'No' }}
                </td>
                <td>
                    {{ romanised }}
                </td>
                <td>
                    {{ ipa }}
                </td>
                <td>
                    {{ meaning }}
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    export default {
        props: {
            t: { required: true },
        },
    }
</script>
