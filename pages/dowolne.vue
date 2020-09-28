<template>
    <div class="container">
        <h2>
            <Icon v="tag"/>
            <T>template.intro</T>:
        </h2>

        <section>
            <div class="alert alert-primary">
                <h2 class="text-center mb-0">
                    <strong><T>template.any.short</T></strong>
                </h2>
                <p class="h6 small text-center mb-0 mt-2">
                    <em>
                        <T>template.any.description</T>
                        (<T>template.any.options</T>)
                    </em>
                </p>
            </div>
        </section>

        <section>
            <h2 class="h4">
                <Icon v="file-signature"/>
                <T>template.examples</T>:
            </h2>

            <ul>
                <li v-for="example in examples" class="my-1">
                    <Example :example="example" :template="randomTemplate()" link/>
                </li>
            </ul>
        </section>

        <section>
            <Share :title="`${$t('template.intro')}: ${$t('template.any.short')}`"/>
        </section>

        <Separator icon="info"/>
        <section class="mb-0">
            <h2 class="h4">
                <Icon v="info-circle"/>
                <T>home.whatisit</T>:
            </h2>
            <T>home.about</T>
            <Homepage align="center"/>
        </section>
    </div>
</template>

<script>
    import { examples, templates } from "~/src/data";
    import { head } from "../src/helpers";

    export default {
        data() {
            return {
                examples: examples,
            }
        },
        head() {
            return head({
                title: 'Moje zaimki to: dowolne',
                banner: 'banner/dowolne.png',
            });
        },
        methods: {
            randomTemplate() {
                const keys = Object.keys(templates);
                return templates[keys[keys.length * Math.random() << 0]];
            },
        }
    }
</script>
