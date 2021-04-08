<template>
    <details v-if="$t('faq.questions.' + question, [], false)" :class="['border mb-3', small ? 'small' : '']">
        <summary :class="['bg-light', small ? 'p-2' : 'p-3']"><T>faq.questions.{{question}}.question</T></summary>
        <div :class="['border-top', small ? 'p-2' : 'p-3']">
            <T>faq.questions.{{question}}.answer</T>
        </div>
    </details>
</template>

<script>
    export default {
        props: {
            question: { required: true },
            small: { type: Boolean },
        }
    }
</script>
