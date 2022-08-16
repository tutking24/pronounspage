<template>
    <section>
        <h2>
            <Icon v="people-carry"/>
            <T>contact.contribute.header</T>
        </h2>
        <p>
            <T>contact.contribute.intro</T>
        </p>
        <div class="row small">
            <div v-for="(icon, area) in areas" class="col-12 col-lg-3">
                <h3 class="h4 mt-3">
                    <Icon :v="icon"/>
                    <T>contact.contribute.{{area}}.header</T>
                </h3>
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
                    translations: 'language',
                    version: 'globe-africa',
                    technical: 'code-merge',
                },
            }
        },
    };
</script>
