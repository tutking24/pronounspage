<template>
    <div class="pt-1">
        <div v-if="config.locale === 'zh'" class="btn-group m-2">
            <button v-for="(display, code) in {traditional: '繁體', simplified: '简体'}"
                    :class="'btn btn-sm ' + (spelling === code ? 'btn-secondary disabled' : 'btn-outline-secondary')"
                    :disabled="spelling === code"
                    @click="setSpelling(code)"
            >
                {{display}}
            </button>
        </div>
        <Dropdown v-if="Object.keys(locales).length > 1" btnClass="btn-outline-secondary btn-sm" class="d-inline-block" :end="end">
            <template v-slot:toggle>
                <Icon v="language"/>
                {{locales[config.locale].name}}
            </template>

            <template v-slot:menu>
                <li v-for="(options, locale) in locales" :key="locale" v-if="locale !== config.locale">
                    <a :href="options.url" class="dropdown-item">
                        {{options.name}}
                    </a>
                </li>
                <li class="dropdown-divider"></li>
                <li>
                    <LocaleLink locale="en" link="/blog/creating-new-language-version" class="dropdown-item small">
                        <Icon v="plus"/>
                        <T>localise.shorter</T>
                    </LocaleLink>
                </li>
            </template>
        </Dropdown>
    </div>
</template>

<script>
    import { mapState } from 'vuex'

    export default {
        props: {
            end: {type: Boolean},
        },
        methods: {
            setSpelling(spelling) {
                this.$store.commit('setSpelling', spelling);
                this.$cookies.set('spelling', this.$store.state.spelling);
            },
        },
        computed: {
            ...mapState([
                'user',
                'spelling',
            ]),
        },
    }
</script>
