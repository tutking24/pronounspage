<template>
    <pre>{{v === undefined ? 'undefined' : JSON.stringify(v, null, 4)}}</pre>
</template>

<script>
    export default {
        props: {
            v: { required: true },
        },
    };
</script>
