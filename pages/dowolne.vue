<template>
    <div class="container">
        <h2>
            <Icon v="tag"/>
            Moje zaimki to:
        </h2>

        <section>
            <div class="alert alert-primary">
                <h2 class="text-center mb-0">
                    <strong>dowolne</strong>
                </h2>
                <p class="h6 small text-center mb-0 mt-2">
                    <em>
                        Choć dla wielu osób niezmiernie ważne jest, by używać wobec nich konkretnych zaimków,
                        innym nie przeszkadza zwracanie się w dowolny sposób
                        – o ile wiadomo z kontekstu, że to o nich mowa
                        (przejrzyj listę możliwości <nuxt-link to="/"><Icon v="share"/>tutaj</nuxt-link>).
                    </em>
                </p>
            </div>
        </section>

        <section>
            <h2 class="h4">
                <Icon v="file-signature"/>
                Przykłady użycia w zdaniu:
            </h2>

            <ul>
                <li v-for="example in examples" class="my-1">
                    <Example :example="example" :template="randomTemplate()" link/>
                </li>
            </ul>
        </section>

        <section>
            <Share title="Moje zaimki to: dowolne"/>
        </section>

        <Separator icon="info"/>
        <section class="mb-0">
            <h2 class="h4">
                <Icon v="info-circle"/>
                O co chodzi w tej stronie?
            </h2>
            <About/>
            <Homepage align="center"/>
        </section>

        <ScrollButton/>
    </div>
</template>

<script>
    import { examples, templates } from "~/src/data";

    export default {
        data() {
            return {
                examples: examples,
            }
        },
        head() {
            const title = 'Moje zaimki to: dowolne • Zaimki.pl';
            const banner = `${process.env.baseUrl}/banner/dowolne.png`;

            return {
                title: title,
                meta: [
                    { hid: 'og:title', property: 'og:title', content: title },
                    { hid: 'twitter:title', property: 'twitter:title', content: title },

                    { hid: 'og:logo', property: 'og:logo', content: banner },
                    { hid: 'twitter:image', property: 'twitter:image', content: banner },
                ],
            }
        },
        methods: {
            randomTemplate() {
                const keys = Object.keys(templates);
                return templates[keys[keys.length * Math.random() << 0]];
            },
        }
    }
</script>
