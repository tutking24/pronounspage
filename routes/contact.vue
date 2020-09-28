<template>
    <div class="container">
        <h2>
            <Icon v="comment-alt-smile"/>
            <T>contact.header</T>
        </h2>

        <section class="mt-0">
            <p class="mb-2">
                <T>contact.authors</T>:
            </p>
            <Authors expanded/>
        </section>

        <Socials/>
    </div>
</template>

<script>
    import { head } from "../src/helpers";

    export default {
        head() {
            return head({
                title: this.$t('contact.header'),
            });
        },
    }
</script>
