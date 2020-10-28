<template>
    <Homepage v-if="config.template.enabled"/>
    <Select v-else/>
</template>

<script>
    import Homepage from '../routes/homepage';
    import Select from '../routes/select';

    export default {
        components: { Homepage, Select },
    }
</script>
