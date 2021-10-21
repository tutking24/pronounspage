<template>
    <div>
        <LinksNav/>

        <div class="row">
            <div class="col-12 col-lg-6">
                <h2>
                    <Icon v="zine.svg"/>
                    <T>links.zine.headerLong</T>
                </h2>

                <T>links.zine.info</T>

                <h3>
                    <T>links.zine.submissions.header</T>
                </h3>

                <ul class="list-unstyled">
                    <li v-for="(val, key) in $t('links.zine.submissions.rules')" class="mb-2">
                        <strong><LinkedText :text="key"/>:</strong>
                        <span><LinkedText :text="val"/></span>
                    </li>
                </ul>

                <p class="small">
                    <Icon v="info-circle"/>
                    <T>links.zine.submissions.disclaimer</T>
                </p>
            </div>
            <div class="col-12 col-lg-6">
                <figure class="float-end border rounded m-3">
                    <img src="/img-local/niebinazin.png" alt=""/>
                </figure>
            </div>
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

<style lang="scss" scoped>
    @import "assets/variables";

    img {
        max-width: 100%;
    }

    figure {
        width: 100%;
    }
</style>
