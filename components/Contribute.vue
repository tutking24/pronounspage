<template>
    <section>
        <h3>
            <Icon v="people-carry"/>
            <T>contact.contribute.header</T>
        </h3>
        <p>
            <T>contact.contribute.intro</T>
        </p>
        <div class="row small">
            <div v-for="(icon, area) in areas" class="col-12 col-lg-3">
                <h4 class="h4 mt-3">
                    <Icon :v="icon"/>
                    <T>contact.contribute.{{area}}.header</T>
                </h4>
                <T>contact.contribute.{{area}}.description</T>
            </div>
        </div>
    </section>
</template>

<script>
    export default {
        data() {
            return {
                areas: {
                    entries: 'database',
                    version: 'globe-africa',
                    translations: 'language',
                    technical: 'code-merge',
                },
            }
        },
    };
</script>
