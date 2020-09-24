<template>
    <div class="container">
        <h2>
            <Icon v="comment-alt-smile"/>
            Kontakt
        </h2>

        <section class="mt-0">
            <p class="mb-2">
                <nuxt-link to="/neutratywy#autor">Autorza</nuxt-link> strony:
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
                title: 'Kontakt',
            });
        },
    }
</script>
