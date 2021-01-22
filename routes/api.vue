<template>
    <div>
        <h2>
            <Icon v="laptop-code"/>
            <T>api.header</T>
        </h2>

        <section v-for="group in groups" v-if="group.enabled" class="py-2">
            <h3>
                <Icon :v="group.icon"/>
                <T>{{group.header}}</T>
            </h3>
            <ul>
                <li v-for="([method, path, queryString], endpoint) in group.endpoints" class="my-3">
                    <p>
                        <span class="badge bg-primary">{{method}}</span>
                        <code>{{path}}</code>
                        <a v-for="example in config.api.examples[endpoint]" :href="$base + example" class="badge bg-light text-dark border mx-1" target="_blank" rel="noopener">
                            <Icon v="cog"/>
                            <T>api.example</T>
                        </a>
                    </p>
                    <p v-if="queryString" class="mb-0 small">
                        <T>api.query</T>:
                    </p>
                    <ul v-if="queryString" class="small">
                        <li v-for="(description, param) in queryString">
                            <code>{{param}}</code> – <span v-html="description"></span>
                        </li>
                    </ul>
                </li>
            </ul>
        </section>
    </div>
</template>

<script>
    import {head} from "../src/helpers";

    export default {
        data() {
            return {
                groups: [{
                    enabled: this.config.pronouns.enabled,
                    header: 'home.header',
                    icon: 'tags',
                    endpoints: {
                        pronouns_all: ['GET', '/api/pronouns'],
                        pronouns_one: ['GET', '/api/pronouns/{pronoun}', {
                            'examples[]': 'Overwrite the default example sentences with custom ones. For each of them use the following format: <code>{sentenceSingular}|{sentencePlural}|{isHonorific}</code>. If <code>sentencePlural</code> is missing, if defaults to being the same as <code>sentenceSingular</code>. <code>isHonorific</code> can be <code>0</code> (default) or <code>1</code>.',
                        }],
                    },
                }, {
                    enabled: this.config.sources.enabled,
                    header: 'sources.header',
                    icon: 'books',
                    endpoints: {
                        sources_all: ['GET', '/api/sources'],
                        sources_one: ['GET', '/api/sources/{id}'],
                    },
                }, {
                    enabled: this.config.nouns.enabled,
                    header: 'nouns.header',
                    icon: 'atom-alt',
                    endpoints: {
                        nouns_all: ['GET', '/api/nouns'],
                        nouns_search: ['GET', '/api/nouns/search/{term}'],
                    },
                }],
            };
        },
        head() {
            return head({
                title: this.$t('api.header'),
            });
        },
    }
</script>
