<template>
    <div v-if="spelling === 'futurysci'" class="my-5">
        <Separator icon="smile-wink"/>
        <div class="row my-5">
            <div class="col-12 col-md-6 offset-md-3">
                <div class="alert alert-warning">
                    <p>
                        <Spelling text="Gratulacje! Udało Ci się odblokować"/> <a href="https://www.webopedia.com/definitions/easter-egg/" target="_blank" rel="noopener">easter egga</a>!
                    </p>
                    <p>
                        <Spelling text="Tak wyglądałaby nasza strona, jeśli trzymałobyśmy się postulatów"/>
                        <a href="https://futurysci.avris.it" target="_blank" rel="noopener">Manifestu Brunona Jaśeńskiego w sprawie ortografji fonetycznej.</a>
                    </p>
                    <p>
                        <a href="https://futurysci.avris.it" target="_blank" rel="noopener" class="btn btn-primary btn-sm"><Spelling text="Więcej informacji"/></a>
                        <button class="btn btn-outline-danger btn-sm" @click="setSpelling('')"><Spelling text="Wyłącz"/></button>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'

const konami = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

export default {
    data() {
        return {
            lastCharacters: [],
        }
    },
    mounted() {
        if (!process.client || this.config.locale !== 'pl') { return; }

        window.addEventListener('keydown', this.keypressed);
    },
    beforeUnmount() {
        window.removeEventListener('keydown', this.keypressed);
    },
    methods: {
        async keypressed(e) {
            this.lastCharacters = [...this.lastCharacters.slice(-9), e.key];
            if (this.lastCharacters.join(',') === konami.join(',')) {
                await this.$alert('Gratulacje! Udało Ći śę odblokować easter egga!<br/>Szczeguły w stopce strony!');
                this.setSpelling('futurysci');
            }
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
