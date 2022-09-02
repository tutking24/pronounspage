<template>
    <Page>
        <h2>
            {{ clearLinkedText(config.pronouns.null.description) }}
        </h2>

        <p>
            <LinkedText :text="config.pronouns.null.history"/>
        </p>

        <AdPlaceholder phkey="main-0" class="my-3"/>

        <Avoiding/>

        <AdPlaceholder phkey="main-1" class="my-3"/>
    </Page>
</template>

<script>
    import { head, clearLinkedText } from "../src/helpers";

    export default {
        data() {
            return {
                clearLinkedText
            };
        },
        head() {
            return head({
                title: this.config.pronouns.null.description,
                description: this.config.pronouns.null.history,
            });
        },
    };
</script>
