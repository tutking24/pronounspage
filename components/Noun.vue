<template>
    <div>
        <ul class="list-singular">
            <li v-for="w in noun[gender]">
                <Abbreviation :v="w" v-slot="{word}">
                    <Declension v-if="gender === 'neutr' && config.nouns.declension" :word="word" tooltip/>
                    <Spelling v-else :text="word"/>
                </Abbreviation>
            </li>
        </ul>
        <ul v-if="config.nouns.plurals" class="list-plural">
            <li v-for="w in noun[gender + 'Pl']">
                <Abbreviation :v="w" v-slot="{word}">
                    <Declension v-if="gender === 'neutr' && config.nouns.declension" :word="word" plural :singularOptions="noun.neutr" tooltip/>
                    <Spelling v-else :text="word"/>
                </Abbreviation>
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
