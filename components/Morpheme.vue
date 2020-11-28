<template>
    <span>
        {{prepend}}{{ pronoun.getMorpheme(morpheme, counter) }}{{append}}
        <span v-if="config.pronunciation.enabled && pronoun.pronounceable && pronoun.getPronunciation(morpheme, counter)" class="text-muted">
            /{{prependPr}}{{pronoun.getPronunciation(morpheme, counter)}}{{appendPr}}/
        </span>
    </span>
</template>

<script>
    export default {
        props: {
            pronoun: { required: true },
            morpheme: { required: true },
            counter: { default: 0 },

            prepend: { default: '' },
            prependPr: { default: '' },
            append: { default: '' },
            appendPr: { default: '' },
        }
    }
</script>
