<template>
    <Page>
    <NotFound v-if="!$isGranted('translations')"/>
    <div v-else>
        <p>
            <nuxt-link to="/admin">
                <Icon v="user-cog"/>
                <T>admin.header</T>
            </nuxt-link>
        </p>
        <h2>
            <Icon v="language"/>
            Missing translations ({{missingTranslations.length}})
        </h2>

        <section>
            <p>
                In order to start translating, enable translation mode with the button in bottom right corner.
                Then you can propose translations both her as well as in context anywhere on the site.
            </p>
            <div class="table-responsive">
                <table class="table table-bordered">
                    <thead>
                    <tr>
                        <th>key</th>
                        <th>base</th>
                        <th>translation</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="mt in missingTranslations">
                        <td>{{mt}}</td>
                        <td>{{translator.get(mt, false, true)}}</td>
                        <td><T>{{mt}}</T></td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </section>
    </div>
    </Page>
</template>

<script>
import {head} from "../src/helpers";
import translator from "@/src/translator";

export default {
    data() {
        return {
            translator,
            missingTranslations: translator.listMissingTranslations(),
        }
    },
    head() {
        return head({
            title: this.$t('admin.header') + ' • Missing translations',
        });
    },
}
</script>
