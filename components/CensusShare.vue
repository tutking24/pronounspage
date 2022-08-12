<template>
    <div class="alert alert-light border">
        <p><T>census.share</T></p>
        <div class="text-center">
            <Share :title="text"/>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        text: { required: true },
    }
}
</script>
