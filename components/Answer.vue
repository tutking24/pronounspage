<template>
    <details
        v-if="$t('faq.questions.' + question, [], false)"
        :class="['border mb-3', small ? 'small' : '']"
        @click="$emit('click')"
        itemscope itemprop="mainEntity" itemtype="https://schema.org/Question"
     >
        <summary :class="['bg-light', small ? 'p-2' : 'p-3']" itemprop="name">
            <T>faq.questions.{{question}}.question</T>
        </summary>
        <div :class="['border-top', small ? 'p-2' : 'p-3']" itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
            <T itemprop="text">faq.questions.{{question}}.answer</T>
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
