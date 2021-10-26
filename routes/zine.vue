<template>
    <div>
        <LinksNav/>

        <h2>
            <Icon v="zine.svg"/>
            <T>links.zine.headerLong</T>
        </h2>

        <T>links.zine.info</T>

        <h3>
            <Icon v="bullhorn"/>
            <T>links.zine.submissions.header</T>
        </h3>

        <div class="alert alert-info">
            <ul class="list-unstyled">
                <li v-for="{icon, label, content} in $t('links.zine.submissions.rules')" class="mb-2">
                    <h4>
                        <Icon :v="icon"/>
                        <LinkedText :text="label"/>:
                    </h4>
                    <ul v-if="Array.isArray(content)">
                        <li v-for="el in content"><LinkedText :text="el"/></li>
                    </ul>
                    <p v-else>
                        <LinkedText :text="content"/>
                    </p>
                </li>
            </ul>

            <p class="small">
                <Icon v="info-circle"/>
                <T>links.zine.submissions.disclaimer</T>
            </p>
        </div>

        <Support/>
        <section>
            <Share :title="$t('links.zine.header')"/>
        </section>
    </div>
</template>

<script>
    import { head } from "../src/helpers";

    export default {
        head() {
            return head({
                title: this.$t('links.zine.headerLong'),
            });
        },
    };
</script>
