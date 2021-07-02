<template>
    <span><template v-for="(text, i) in texts"><LinkedText :text="text.trim()" :noicons="noicons"/><span v-if="i !== texts.length - 1">{{ glue }}</span></template></span>
</template>

<script>
    export default {
        props: {
            texts: { required: true },
            glue: { 'default': ', '},
            noicons: { type: Boolean },
        },
    }
</script>
