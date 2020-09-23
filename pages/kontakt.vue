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
    export default {
        head() {
            const title = 'Kontakt • Zaimki.pl';

            return {
                title: title,
                meta: [
                    { hid: 'og:title', property: 'og:title', content: title },
                    { hid: 'twitter:title', property: 'twitter:title', content: title },
                ],
            }
        },
    }
</script>
