<template>
    <div v-if="message" :class="'alert alert-' + type">
        <p class="mb-0">
            <Icon v="exclamation-triangle"/>
            <T>{{message}}</T>
        </p>
    </div>
</template>

<script>
    export default {
        props: {
            type: { required: true },
            message: {},
        }
    }
</script>
