<template>
    <div class="pt-1">
        <div v-if="spellings.hasOwnProperty(config.locale)" class="btn-group m-2">
            <button v-for="(display, code) in spellings[config.locale]"
                    :class="['btn btn-sm', getSpelling() === code ? 'btn-secondary disabled' : 'btn-outline-secondary', code === 'sitelen' ? 'sitelen' : '']"
                    :disabled="getSpelling() === code"
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
                    <a href="https://pronouns.page" class="dropdown-item small">
                        <Logo class="mb-1"/>
                        pronouns.page
                    </a>
                </li>
                <li class="dropdown-divider"></li>
                <li>
                    <LocaleLink locale="en" link="/new-version" class="dropdown-item small">
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
        data() {
            return {
                spellings: {
                    zh: {traditional: '繁體', simplified: '简体'},
                    tok: {latin: 'Lasin', sitelen: 'sitelen pona'},
                }
            };
        },
        methods: {
            getSpelling() {
                return this.spelling || (
                    this.spellings.hasOwnProperty(this.config.locale)
                        ? Object.keys(this.spellings[this.config.locale])[0]
                        : null
                );
            },
            setSpelling(spelling) {
                this.$store.commit('setSpelling', spelling);
                this.$cookies.set('spelling', this.$store.state.spelling);
            },
        },
        computed: {
            ...mapState([
                'spelling',
            ]),
        },
    }
</script>
