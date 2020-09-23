<template>
    <div class="container">
        <h2>
            <Icon v="comment-alt-smile"/>
            Kontakt
        </h2>

        <section>
            <Authors expanded/>
        </section>
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
