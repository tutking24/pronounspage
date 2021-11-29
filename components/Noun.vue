<template>
    <div>
        <ul class="list-singular">
            <li v-for="w in noun[gender]">
                <Declension v-if="gender === 'neutr' && config.nouns.declension" :word="w" tooltip/>
                <Spelling v-else :text="w"/>
            </li>
        </ul>
        <ul v-if="config.nouns.plurals" class="list-plural">
            <li v-for="w in noun[gender + 'Pl']">
                <Declension v-if="gender === 'neutr' && config.nouns.declension" :word="w" plural :singularOptions="noun.neutr" tooltip/>
                <Spelling v-else :text="w"/>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        props: {
            noun: {required: true},
            gender: {required: true},
        },
    }
</script>
