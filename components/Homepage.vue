<template>
    <p :class="['text-' + align, 'mb-0']">
        <nuxt-link to="/" class="btn btn-outline-primary btn-sm">
            <Icon v="home"/>
            Strona główna
        </nuxt-link>
    </p>
</template>

<script>
    export default {
        props: {
            align: { default: 'right' }
        }
    }
</script>
