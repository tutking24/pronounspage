<template>
    <Homepage v-if="config.header"/>
    <Select v-else/>
</template>

<script>
    import Homepage from '../routes/homepage';
    import Select from '../routes/select';

    export default {
        components: { Homepage, Select },
    }
</script>
