<template>
    <section class="w-100">
        <div v-show="isLoaded">
            <slot/>
        </div>
        <p class="text-center" v-show="!isLoaded">
            <Spinner :size="size"/>
        </p>
    </section>
</template>

<script>
    export default {
        props: {
            value: { required: true },
            size: {'default': '5rem'},
        },
        computed: {
            isLoaded() {
                return this.value !== undefined;
            },
        },
    };
</script>
