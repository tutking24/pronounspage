<template>
    <Page>
        <h2>
            {{ clearLinkedText(config.pronouns.mirror.name) }}
        </h2>

        <p>
            <LinkedText :text="config.pronouns.mirror.description"/>
        </p>

        <ul>
            <li v-for="example in config.pronouns.mirror.example">
                <LinkedText :text="example"/>
            </li>
        </ul>

        <AdPlaceholder phkey="main-0" class="my-3"/>
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
                title: this.config.pronouns.mirror.name,
                description: this.config.pronouns.mirror.description,
            });
        },
    };
</script>
