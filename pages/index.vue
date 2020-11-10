<template>
    <Homepage v-if="config.pronouns.enabled"/>
    <Select v-else/>
</template>

<script>
    import Homepage from '../routes/homepage';
    import Select from '../routes/select';

    export default {
        components: { Homepage, Select },
    }
</script>
